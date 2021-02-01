import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ImportFromExcelModalComponent} from "../import-from-excel-modal.component";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../../core/store/index.reducers";
import {selectAllVisitBans} from "../../../../core/store/visit-bans/visit-bans.selectors";
import {first, take, tap} from "rxjs/operators";
import {selectAllTerritories} from "../../../../core/store/territories/territories.selectors";
import {selectAllDrawings} from "../../../../core/store/drawings/drawings.selectors";
import {combineLatest} from "rxjs";
import {BulkImportVisitBans, BulkImportVisitBansSuccess} from "../../../../core/store/visit-bans/visit-bans.actions";
import {Actions, ofType} from "@ngrx/effects";
import {WaitingModalComponent} from "../../../shared/modals/waiting-modal/waiting-modal.component";
import {VisitBan} from "@territory-offline-workspace/api";
import {TranslateService} from '@ngx-translate/core';
import {VisitBanImportMapperStepper} from "./visit-ban-import-mapper-stepper";
import {MatStepper} from "@angular/material/stepper";
import {ExcelToEntityMapper} from "../../../../core/utils/excel/excel-to-entity-mapper";
import {ExcelColumn} from "../../../../core/utils/excel/excel-column";
import {ExcelToEntityParser} from "../../../../core/utils/excel/excel-to-entity-parser";
import {GpsToTerritoryLocator} from "../../../../core/services/territory/gps-to-territory-locator";

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
    // TODO:
    // was passiert wenn keine GPS Koordinaten vorhanden sind?
    // was passiert mit Einträgen, die einem Gebiet nicht zugeordnet werden können? (obwohl GPS vllt da sind - kein matching...)
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
      first(),
      tap(([existingVisitBans, territories, drawings]) =>
      {
        const excelToEntityParser = new ExcelToEntityParser(this.excelToEntityMapper, this.workbook);
        let parsedVisitBans = excelToEntityParser.extractVisitBans();
        const locator = new GpsToTerritoryLocator(territories, drawings);

        parsedVisitBans = parsedVisitBans.map(vb => ({...vb, territoryId: locator.locate(vb.gpsPosition)}));

        const orphanVisitBans = parsedVisitBans.filter(ed => !ed.territoryId);
        let toBeImported = parsedVisitBans;

        if (this.overrideExistingData)
        {
          toBeImported = this.overrideExistingVisitBans(existingVisitBans, toBeImported);
        }

        this.actions$.pipe(
          ofType(BulkImportVisitBansSuccess),
          tap(() => this.importDone = true),
          tap(() => waitingModal.close())
        ).subscribe();

        this.store.dispatch(BulkImportVisitBans({visitBans: toBeImported}));

        if (orphanVisitBans && orphanVisitBans.length > 0)
        {
          this.visitBansWithoutTerritory = orphanVisitBans;
        }
      })
    ).subscribe();
  }

  public overrideExistingVisitBans(existing: VisitBan[], toBeImported: VisitBan[]): VisitBan[]
  {
    const overridden = [] as string[];
    const superset = [];

    existing.forEach((existingVisitBan) =>
    {
      const foundToBeImportedVisitBan = toBeImported.find(toBeImportedVisitBan =>
        toBeImportedVisitBan.street && existingVisitBan.street &&
        toBeImportedVisitBan.street.toLowerCase().trim() === existingVisitBan.street.toLocaleLowerCase().trim() &&
        toBeImportedVisitBan.streetSuffix.toLowerCase().trim() === existingVisitBan.streetSuffix.toLocaleLowerCase().trim()
      );

      if (foundToBeImportedVisitBan)
      {
        superset.push({...foundToBeImportedVisitBan, id: existingVisitBan.id});
        overridden.push(foundToBeImportedVisitBan.id);
      }
      else
      {
        superset.push(existingVisitBan);
      }
    });

    return [...superset, ...toBeImported.filter(vb => !overridden.includes(vb.id))];
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
