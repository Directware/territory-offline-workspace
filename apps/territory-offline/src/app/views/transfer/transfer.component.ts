import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TerritoryHelperImportComponent} from "./territory-helper-import/territory-helper-import.component";
import {SyncDataComponent} from "./sync-data/sync-data.component";
import {PdfDataExportService} from "../../core/services/export/pdf-data-export.service";
import {BehaviorSubject, Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../core/store/index.reducers";
import {selectCurrentCongregation} from "../../core/store/congregation/congregations.selectors";
import {first, map, take, tap} from "rxjs/operators";
import {DataExportService} from "../../core/services/import/data-export.service";
import {wholeTerritory} from "../../core/store/drawings/drawings.selectors";
import * as tokml from "tokml";
import {PlatformAgnosticActionsService} from "../../core/services/common/platform-agnostic-actions.service";
import {ImportFromExcelModalComponent} from "./import-from-excel-modal/import-from-excel-modal.component";
import {ExcelDataExportService} from "../../core/services/export/excel-data-export.service";
import * as Pako from 'pako';
import {AssignmentsService} from "../../core/services/assignment/assignments.service";
import {Drawing, Territory, TerritoryCard} from "@territory-offline-workspace/api";
import {TranslateService} from '@ngx-translate/core';
import {TerritoryWebTerritories} from "../../../../../../libs/api/src/lib/territory-web/territory-web.territories";
import {DataImportService} from "../../core/services/import/data-import.service";
import {uuid4} from "@capacitor/core/dist/esm/util";
import * as Turf from '@turf/turf';
import {BackupImportProgressComponent} from "../shared/modals/backup-import-progress/backup-import-progress.component";
import {selectAllTerritories} from "../../core/store/territories/territories.selectors";
import {BulkUpsertTerritory} from "../../core/store/territories/territories.actions";

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit
{
  public congregationName$: Observable<string>;

  constructor(private router: Router,
              private excelDataExportService: ExcelDataExportService,
              private store: Store<ApplicationState>,
              private assignmentsService: AssignmentsService,
              private dataExportService: DataExportService,
              private dataImportService: DataImportService,
              private platformAgnosticActionsService: PlatformAgnosticActionsService,
              private pdfDataExportService: PdfDataExportService,
              private matDialog: MatDialog,
              private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
    this.congregationName$ = this.store.pipe(select(selectCurrentCongregation), map(congregation => congregation.name));
    this.router.navigate([{outlets: {'second-thread': null}}]);
  }

  public openSyncDialog()
  {
    this.matDialog.open(SyncDataComponent);
  }

  public showTerritoryHelperImportDialog()
  {
    this.matDialog.open(TerritoryHelperImportComponent);
  }

  public async exportToBackupFile()
  {
    await this.dataExportService.exportAllAndShare()
  }

  public exportS13()
  {
    this.pdfDataExportService.exportS13();
  }

  public exportWholeMap()
  {
    const today = new Date();
    this.store.pipe(
      select(wholeTerritory),
      take(1),
      tap(data =>
      {
        if (!data || !data.mergedDrawings)
        {
          this.translate.get('transfer.export.noTerritories').pipe(take(1)).subscribe((translation: string) =>
            alert(translation));
          return;
        }

        data.mergedDrawings.featureCollection.features.forEach(f =>
        {
          f.properties["color"] = "#4f9cdc";
          f.properties["color_blue"] = "#4f9cdc";
          f.properties["color_green"] = "#15c880";
          f.properties["color_orange"] = "#FF9F1B";
          f.properties["color_red"] = "#ff5f1b";
          delete f.properties["drawingId"];
          delete f.properties["opacity"];
          delete f.properties["isAssigned"];
          delete f.properties["status"];
        });

        const fileName = `${data.congregation} - ${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}.kml`;
        const kml = tokml(data.mergedDrawings.featureCollection, {
          documentName: fileName,
          name: "description" // property name of geojson properties that should be export als name
        });

        this.platformAgnosticActionsService.share(kml, fileName)
      })
    ).subscribe();
  }

  public exportVisitBans()
  {
    this.excelDataExportService.exportVisitBans();
  }

  public exportPublishers()
  {
    this.excelDataExportService.exportPublishers();
  }

  public exportTerritoryNames()
  {
    this.excelDataExportService.exportTerritoryNames();
  }

  public exportTerritoryState()
  {
    this.excelDataExportService.exportTerritoryState();
  }

  public importFromExcel(type: string)
  {
    this.matDialog.open(ImportFromExcelModalComponent, {
      width: "37.5rem",
      minHeight: "37.25rem",
      panelClass: "excel-import-dialog",
      data: {
        importType: type
      }
    });
  }

  public importTerritoryFromFieldCompanion(event)
  {
    if (event.target.files && event.target.files.length)
    {
      const [file] = event.target.files;
      const binaryFileReader = new FileReader();
      binaryFileReader.onload = () => this.readBinaryFile(binaryFileReader.result as any);
      binaryFileReader.readAsArrayBuffer(file);
    }
  }

  public importTerritoryWebTerritories(event)
  {
    if (event.target.files && event.target.files.length)
    {
      const [file] = event.target.files;
      const jsonFileReader = new FileReader();
      jsonFileReader.onload = () =>
      {
        const json = JSON.parse(jsonFileReader.result + "") as TerritoryWebTerritories;

        const drawings: Drawing[] = [];
        const territories: Territory[] = [];

        json.features.forEach((feature) =>
        {
          const drawingId = uuid4();
          territories.push({
            id: uuid4(),
            key: feature.properties.TerritoryNumber,
            name: feature.properties.name,
            populationCount: 0,
            tags: [],
            territoryDrawingId: drawingId,
            boundaryNames: [],
            comment: "",
            creationTime: new Date()
          });

          drawings.push({
            id: drawingId,
            creationTime: new Date(),
            featureCollection: Turf.featureCollection([Turf.feature(feature.geometry)])
          });
        });

        this.importTWTerritories(territories, drawings);
      };

      jsonFileReader.readAsText(file);
    }
  }

  public async importAnyData(event)
  {
    if (event.target.files && event.target.files.length)
    {
      const territories = await this.store.pipe(select(selectAllTerritories), first()).toPromise();
      const [file] = event.target.files;
      const jsonFileReader = new FileReader();
      jsonFileReader.onload = () =>
      {
        const json = JSON.parse(jsonFileReader.result + "") as TerritoryWebTerritories;
        console.log(json, json.features.length);

        let i = 0;
        const territoriesToUpdate = [];
        json.features.forEach(data => {

          if(data.properties.description)
          {
            const test = data.properties.TerritoryTypeCode + " " + data.properties.TerritoryNumber;
            const test2 = data.properties.TerritoryType;

            const we = parseInt(data.properties.description.replace("WE ", ""), 10);
            const territory = territories.filter(ter => ter.key === test && ter.name === test2)[0];
            console.log(test2 + " " + test + " | " + we, territory)
            territoriesToUpdate.push({
              ...territory,
              populationCount: we
            });
            i++;
          }

        });

        // this.store.dispatch(BulkUpsertTerritory({territories: territoriesToUpdate}));

        console.log(i);
      };

      jsonFileReader.readAsText(file);
    }
  }

  private async readBinaryFile(data: any)
  {
    const unGzippedData = Pako.ungzip(data, {to: "string"});
    const json: TerritoryCard = JSON.parse(unGzippedData);
    this.assignmentsService.giveBackFromFieldCompanion(json);
  }

  private async importTWTerritories(territories: Territory[], drawings: Drawing[])
  {
    const translations = await this.translate.get(["transfer.import.title", 'transfer.import.ok', 'transfer.import.territories', 'transfer.import.drawings']).toPromise();
    const dialogConfig = new MatDialogConfig();
    const progressMsg = new BehaviorSubject({label: translations["transfer.import.title"], icon: null});

    dialogConfig.disableClose = true;
    dialogConfig.width = "32rem";
    dialogConfig.data = {progressMsg: progressMsg};
    const importProgressDialogRef = this.matDialog.open(BackupImportProgressComponent, dialogConfig);

    progressMsg.next({label: `${territories.length} ${translations['transfer.import.territories']}`, icon: null});
    await this.dataImportService.importTerritories(territories).toPromise();
    progressMsg.next({label: translations["transfer.import.ok"], icon: "check"});
    progressMsg.next({label: `${drawings.length} ${translations['transfer.import.drawings']}`, icon: null})
    await this.dataImportService.importDrawings(drawings).toPromise();
    progressMsg.next({label: translations["transfer.import.ok"], icon: "check"});
    progressMsg.complete();

    importProgressDialogRef.close();
  }
}
