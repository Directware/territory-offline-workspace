import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from "@angular/material/dialog";
import {TerritoryHelperImportComponent} from "./territory-helper-import/territory-helper-import.component";
import {SyncDataComponent} from "./sync-data/sync-data.component";
import {PdfDataExportService} from "../../core/services/export/pdf-data-export.service";
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../core/store/index.reducers";
import {selectCurrentCongregation} from "../../core/store/congregation/congregations.selectors";
import {map, take, tap} from "rxjs/operators";
import {DataExportService} from "../../core/services/import/data-export.service";
import {wholeTerritory} from "../../core/store/drawings/drawings.selectors";
import * as tokml from "tokml";
import {PlatformAgnosticActionsService} from "../../core/services/common/platform-agnostic-actions.service";
import {ImportFromExcelModalComponent} from "./import-from-excel-modal/import-from-excel-modal.component";
import {ExcelDataExportService} from "../../core/services/export/excel-data-export.service";

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
              private dataExportService: DataExportService,
              private platformAgnosticActionsService: PlatformAgnosticActionsService,
              private pdfDataExportService: PdfDataExportService,
              private matDialog: MatDialog)
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
        if(!data || !data.mergedDrawings)
        {
          alert("Es gibt keine Gebiete zum exportieren!");
          return;
        }

        data.mergedDrawings.featureCollection.features.forEach(f => {
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
}
