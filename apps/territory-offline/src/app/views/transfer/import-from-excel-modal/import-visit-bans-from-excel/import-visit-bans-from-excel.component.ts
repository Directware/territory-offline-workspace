import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
import * as Turf from '@turf/turf';
import {BulkImportVisitBans, BulkImportVisitBansSuccess} from "../../../../core/store/visit-bans/visit-bans.actions";
import {uuid4} from "@capacitor/core/dist/esm/util";
import {Actions, ofType} from "@ngrx/effects";
import {WaitingModalComponent} from "../../../shared/modals/waiting-modal/waiting-modal.component";
import {parseXlsxDate} from "../../../../core/utils/usefull.functions";
import {Drawing, Territory, VisitBan} from "@territory-offline-workspace/api";
import {TranslateService} from '@ngx-translate/core';
import {VisitBanImportMapperStepper} from "./visit-ban-import-mapper-stepper";
import {MatStepper} from "@angular/material/stepper";
import {ExcelToEntityMapper} from "../../../../core/utils/excel/excel-to-entity-mapper";
import {ExcelColumn} from "../../../../core/utils/excel/excel-column";

@Component({
  selector: 'app-import-visit-bans-from-excel',
  templateUrl: './import-visit-bans-from-excel.component.html',
  styleUrls: ['./import-visit-bans-from-excel.component.scss']
})
export class ImportVisitBansFromExcelComponent implements OnInit, AfterViewInit
{
  @Input()
  public workbook: XLSX.WorkBook;

  @ViewChild(MatStepper, {static: false})
  public matStepper: MatStepper;

  public steps = ["name", "street", "streetSuffix", "city", "latitude", "longitude", "comment", "lastVisit", "creationTime"];
  public titles = ["chooseNameColumns", "chooseStreetColumn", "chooseHouseNumberColumn", "chooseCitiesColumn", "chooseLatitudeColumn", "chooseLongitudeColumn", "chooseCommentColumn", "chooseLastVisitColumn", "chooseCreationTimeColumn"];

  public foundColumns: ExcelColumn[];
  public overrideExistingData: boolean;
  public importDone: boolean;
  public visitBansWithoutTerritory: VisitBan[];
  public excelToEntityMapper: ExcelToEntityMapper;
  public visitBanImportMapperStepper: VisitBanImportMapperStepper;

  constructor(private store: Store<ApplicationState>,
              private actions$: Actions,
              private elementRef: ElementRef,
              private matDialog: MatDialog,
              private dialogRef: MatDialogRef<ImportFromExcelModalComponent>,
              private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
  }

  public async ngAfterViewInit()
  {
    // expression changed after it was checked bei isLastStep()
    setTimeout(() => this.visitBanImportMapperStepper = new VisitBanImportMapperStepper(this.matStepper));
  }

  public nextStep()
  {
    this.visitBanImportMapperStepper.nextStep();
    this.scrollMatStepToTop();

    if (this.visitBanImportMapperStepper.currentStep() === 1)
    {
      this.readColumnsOfCurrentSheet();
    }
  }

  public isLastStep(): boolean
  {
    return this.visitBanImportMapperStepper && this.visitBanImportMapperStepper.isLastStep();
  }

  public close()
  {
    this.dialogRef.close();
  }

  public setSheet(sheetName: string)
  {
    this.excelToEntityMapper = new ExcelToEntityMapper(sheetName);
  }

  public setChosenProp(step: string, column: ExcelColumn)
  {
    this.excelToEntityMapper.setValueOf(step, column)
  }

  public shouldHide(step: string, column: ExcelColumn): boolean
  {
    return this.excelToEntityMapper.isValueAlreadyInUse(column) && this.excelToEntityMapper.getColumnValueOf(step) !== column.value;
  }

  public import()
  {
    const waitingModal = this.matDialog.open(WaitingModalComponent, {disableClose: true});
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

        this.store.dispatch(BulkImportVisitBans({visitBans: extractedDataWithTerritory}));

        if (!!extractedDataWithoutTerritory && extractedDataWithoutTerritory.length > 0)
        {
          this.visitBansWithoutTerritory = extractedDataWithoutTerritory;
        }
      })
    ).subscribe();
  }

  private extractDataFromSheet(territories: Territory[], drawings: Drawing[])
  {
    const sheet = this.workbook.Sheets[this.excelToEntityMapper.sheetName];
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    const tmp = [];
    let territoryId = null;

    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++)
    {
      const name = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("name")})];
      const street = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("street")})];
      const streetSuffix = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("streetSuffix")})];
      const city = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("city")})];
      const comment = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("comment")})];
      const latitude = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("latitude")})];
      const longitude = sheet[XLSX.utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("longitude")})];

      const lat = latitude ? parseFloat(latitude["v"]) : null;
      const lng = longitude ? parseFloat(longitude["v"]) : null;

      if (!!lat && !!lng && !isNaN(lat) && !isNaN(lng))
      {
        drawings.forEach(d => d.featureCollection.features.forEach((f: any) =>
        {
          const point = Turf.point([lng, lat]);

          let isIn = false;
          try
          {
            isIn = Turf.booleanPointInPolygon(point, f)
          } catch (e)
          {
          }

          if (isIn)
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
        lastVisit: parseXlsxDate(sheet[XLSX.utils.encode_cell({
          r: rowNum,
          c: this.excelToEntityMapper.getColumnIndexOf("lastVisit")
        })]),
        creationTime: parseXlsxDate(sheet[XLSX.utils.encode_cell({
          r: rowNum,
          c: this.excelToEntityMapper.getColumnIndexOf("creationTime")
        })]),
        gpsPosition: {lat: lat, lng: lng},
        territoryId: territoryId
      });
    }

    return tmp;
  }

  private async readColumnsOfCurrentSheet()
  {
    const translation = await this.translate.get('transfer.import.column').pipe(take(1)).toPromise();
    this.foundColumns = [];
    const sheet = this.workbook.Sheets[this.excelToEntityMapper.sheetName];
    const range = XLSX.utils.decode_range(sheet["!ref"]);

    for (let colNum = range.s.c; colNum <= range.e.c; colNum++)
    {
      const cell = sheet[XLSX.utils.encode_cell({r: 0, c: colNum})];

      if (cell && cell["t"] === "s")
      {
        const value = cell["v"];
        this.foundColumns.push({
          label: `${colNum + 1}. ${translation} - ${value}`,
          index: colNum,
          value: value
        });
      }

      if (cell && cell["t"] === "n")
      {
        const value = XLSX.SSF.parse_date_code(cell["v"]);
        this.foundColumns.push({
          label: `${colNum + 1}. ${translation} - ${value.d}.${value.m}.${value.y}`,
          index: colNum,
          value: value
        });
      }
    }
  }

  private scrollMatStepToTop()
  {
    setTimeout(() =>
    {
      const currentStep = this.visitBanImportMapperStepper.currentStep();
      const dialogBody = this.elementRef.nativeElement.querySelector(".body") as HTMLDivElement;
      const currentStepHeaderElement = this.elementRef.nativeElement.querySelectorAll(".mat-step-header")[currentStep] as HTMLElement;

      dialogBody.scroll({
        top: currentStepHeaderElement.offsetTop,
        behavior: 'smooth'
      });
    }, 300);
  }
}
