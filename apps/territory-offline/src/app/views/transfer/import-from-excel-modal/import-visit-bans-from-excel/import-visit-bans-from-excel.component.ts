import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ImportFromExcelModalComponent} from "../import-from-excel-modal.component";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../../core/store/index.reducers";
import {selectAllVisitBans} from "../../../../core/store/visit-bans/visit-bans.selectors";
import {take, tap} from "rxjs/operators";
import {selectAllTerritories} from "../../../../core/store/territories/territories.selectors";
import {selectAllDrawings} from "../../../../core/store/drawings/drawings.selectors";
import {combineLatest} from "rxjs";
import {Territory} from "../../../../core/store/territories/model/territory.model";
import {Drawing} from "../../../../core/store/drawings/model/drawing.model";
import * as Turf from '@turf/turf';
import {BulkImportVisitBans, BulkImportVisitBansSuccess} from "../../../../core/store/visit-bans/visit-bans.actions";
import {uuid4} from "@capacitor/core/dist/esm/util";
import {Actions, ofType} from "@ngrx/effects";
import {VisitBan} from "../../../../core/store/visit-bans/model/visit-ban.model";
import {WaitingModalComponent} from "../../../shared/modals/waiting-modal/waiting-modal.component";
import {parseXlsxDate} from "../../../../core/utils/usefull.functions";

@Component({
  selector: 'app-import-visit-bans-from-excel',
  templateUrl: './import-visit-bans-from-excel.component.html',
  styleUrls: ['./import-visit-bans-from-excel.component.scss']
})
export class ImportVisitBansFromExcelComponent implements OnInit, AfterViewChecked
{
  @Input()
  public currentStep: number;

  @Input()
  public workbook: XLSX.WorkBook;

  public steps = ["", "sheetName", "name", "street", "streetSuffix", "city", "latitude", "longitude", "comment", "lastVisit", "creationTime"];
  public chosenProps = {};
  public foundColumns = [];
  public overrideExistingData: boolean;
  public importDone: boolean;
  public visitBansWithoutTerritory: VisitBan[];

  constructor(private store: Store<ApplicationState>,
              private actions$: Actions,
              private matDialog: MatDialog,
              private dialogRef: MatDialogRef<ImportFromExcelModalComponent>)
  {
  }

  public ngOnInit(): void
  {
  }

  public ngAfterViewChecked()
  {
    if (this.currentStep === 2 && this.foundColumns.length === 0)
    {
      const sheet = this.workbook.Sheets[this.chosenProps[this.steps[1]]];
      const range = XLSX.utils.decode_range(sheet["!ref"]);

      for (let colNum = range.s.c; colNum <= range.e.c; colNum++)
      {
        const cell = sheet[XLSX.utils.encode_cell({r: 0, c: colNum})];

        if (cell && cell["t"] === "s")
        {
          const value = cell["v"];
          this.foundColumns.push({
            label: `${colNum + 1}. Spalte - ${value}`,
            index: colNum
          });
        }

        if (cell && cell["t"] === "n")
        {
          const value = XLSX.SSF.parse_date_code(cell["v"]);
          this.foundColumns.push({
            label: `${colNum + 1}. Spalte - ${value.d}.${value.m}.${value.y}`,
            index: colNum
          });
        }
      }
    }
  }

  public close()
  {
    this.dialogRef.close();
  }

  public setSheet(sheetName: string)
  {
    this.chosenProps[this.steps[this.currentStep]] = sheetName;
  }

  public setChosenProp(column: any)
  {
    this.chosenProps[this.steps[this.currentStep]] = column.index;
  }

  public shouldHide(column: any): boolean
  {
    return this.chosenProps[this.steps[this.currentStep]] !== column.index && Object.values(this.chosenProps).includes(column.index);
  }

  public showChosenProp(column: any)
  {
    const key = Object.keys(this.chosenProps).filter(key => this.chosenProps[key] === column.index)[0];
    return {
      label: key ? `importExcel.visitBans.${key}` : "importExcel.skipped",
      isGreen: !!key
    }
  }

  public import()
  {
    const waitingModal = this.matDialog.open(WaitingModalComponent);
    combineLatest([
      this.store.pipe(select(selectAllVisitBans)),
      this.store.pipe(select(selectAllTerritories)),
      this.store.pipe(select(selectAllDrawings)),
    ]).pipe(
      take(1),
      tap(([visitBans, territories, drawings]) =>
      {
        const extractedData = this.extractDataFromSheet(territories, drawings);
        const extractedDataWithoutTerritory = extractedData.filter(ed => !ed.territoryId);
        const extractedDataWithTerritory = extractedData.filter(ed => !!ed.territoryId);

        if (this.overrideExistingData)
        {
          extractedDataWithTerritory.forEach((vb) =>
          {
            const foundVbs = visitBans.filter((evb) =>
              evb.street.toLowerCase() === vb.street.toLowerCase()
              && evb.streetSuffix.toLowerCase() === vb.streetSuffix.toLocaleLowerCase()
            );

            if (foundVbs.length === 1)
            {
              vb.id = foundVbs[0].id;
            }
            else
            {
              const foundVbsWithName = foundVbs.filter(evb => !!evb.name && !!vb.name && evb.name.toLowerCase() === vb.name.toLowerCase())

              if (foundVbsWithName.length === 0)
              {
                // its a new entry
                vb.id = uuid4();
              }
              else if (foundVbsWithName.length === 1)
              {
                vb.id = foundVbsWithName[0].id;
              }
              else
              {
                // because its ambiguous - new entry
                vb.id = uuid4();
              }
            }
          });
        }

        // catch last visit bans without uuid
        extractedDataWithTerritory.filter(vb => !vb.id).forEach(vb => vb.id = uuid4());

        this.actions$.pipe(
          ofType(BulkImportVisitBansSuccess),
          tap(() => this.importDone = true),
          tap(() => waitingModal.close())
        ).subscribe();

        // this.store.dispatch(BulkImportVisitBans({visitBans: extractedDataWithTerritory}));

        if (!!extractedDataWithoutTerritory && extractedDataWithoutTerritory.length > 0)
        {
          this.visitBansWithoutTerritory = extractedDataWithoutTerritory;
        }
      })
    ).subscribe();
  }

  private extractDataFromSheet(territories: Territory[], drawings: Drawing[])
  {
    const sheet = this.workbook.Sheets[this.chosenProps[this.steps[1]]];
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    const tmp = [];
    let territoryId = null;

    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++)
    {
      const name = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.chosenProps["name"]})];
      const street = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.chosenProps["street"]})];
      const streetSuffix = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.chosenProps["streetSuffix"]})];
      const city = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.chosenProps["city"]})];
      const comment = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.chosenProps["comment"]})];
      const latitude = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.chosenProps["latitude"]})];
      const longitude = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.chosenProps["longitude"]})];

      const lat = latitude ? parseFloat(latitude["v"]) : null;
      const lng = longitude ? parseFloat(longitude["v"]) : null;

      if (!!lat && !!lng && !isNaN(lat) && !isNaN(lng))
      {
        drawings.forEach(d => d.featureCollection.features.forEach((f: any) =>
        {
          const point = Turf.point([lng, lat]);
          if (Turf.booleanPointInPolygon(point, f))
          {
            territoryId = territories.filter(t => t.territoryDrawingId === d.id)[0].id;
          }
        }));
      }
      else
      {
          // TODO implement geo coding
      }

      tmp.push({
        name: name ? name["v"] : "",
        street: street ? street["v"] : "",
        streetSuffix: streetSuffix ? streetSuffix["v"] : "",
        city: city ? city["v"] : "",
        comment: comment ? comment["v"] : "",
        lastVisit: parseXlsxDate(sheet[XLSX.utils.encode_cell({r: rowNum, c: this.chosenProps["lastVisit"]})]),
        creationTime: parseXlsxDate(sheet[XLSX.utils.encode_cell({r: rowNum, c: this.chosenProps["creationTime"]})]),
        gpsPosition: {lat: lat, lng: lng},
        territoryId: territoryId
      });
    }

    return tmp;
  }
}
