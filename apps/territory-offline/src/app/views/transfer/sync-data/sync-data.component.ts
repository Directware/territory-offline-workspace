import {Component, OnInit} from '@angular/core';
import {DataImportService} from "../../../core/services/import/data-import.service";
import {DataExportService} from "../../../core/services/import/data-export.service";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import * as Pako from 'pako';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-sync-data',
  templateUrl: './sync-data.component.html',
  styleUrls: ['./sync-data.component.scss']
})
export class SyncDataComponent implements OnInit
{
  constructor(private store: Store<ApplicationState>,
              private matDialogRef: MatDialogRef<SyncDataComponent>,
              private dataImportService: DataImportService,
              private dataExportService: DataExportService)
  {
  }

  public ngOnInit(): void
  {
  }

  public async exportData()
  {
    await this.dataExportService.exportAllAndShare();
    this.matDialogRef.close();
  }

  public importFile(event)
  {
    const jsonReader = new FileReader();

    if (event.target.files && event.target.files.length)
    {
      const [file] = event.target.files;

      jsonReader.onload = () =>
        this.jsonSyncFileOnload(jsonReader.result as any).catch((e) =>
        {
          console.log("Keine JSON Struktur.", e);
          const binaryFileReader = new FileReader();
          binaryFileReader.onload = () => this.binarySyncFileOnload(binaryFileReader.result as any);
          binaryFileReader.readAsArrayBuffer(file);
        });

      jsonReader.readAsText(file);
    }
  }

  private async jsonSyncFileOnload(data: any)
  {
    const json = JSON.parse(data);
    await this.dataImportService.importBackup(json)
    this.matDialogRef.close();
  }

  private async binarySyncFileOnload(data: any)
  {
    const unGzippedData = Pako.ungzip(data, {to: "string"});
    await this.jsonSyncFileOnload(unGzippedData);
    this.matDialogRef.close();
  }
}
