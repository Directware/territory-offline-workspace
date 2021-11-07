import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataImportService } from '../../../core/services/import/data-import.service';
import { DataExportService } from '../../../core/services/import/data-export.service';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../core/store/index.reducers';
import * as Pako from 'pako';
import { MatDialogRef } from '@angular/material/dialog';
import { Plugins } from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';

const { FileSelector, Device } = Plugins;

@Component({
  selector: 'app-sync-data',
  templateUrl: './sync-data.component.html',
  styleUrls: ['./sync-data.component.scss'],
})
export class SyncDataComponent implements OnInit {
  @ViewChild('syncFileChooser', { static: false })
  public syncFileChooser: ElementRef;

  constructor(
    private store: Store<ApplicationState>,
    private matDialogRef: MatDialogRef<SyncDataComponent>,
    private translateService: TranslateService,
    private dataImportService: DataImportService,
    private dataExportService: DataExportService
  ) {}

  public ngOnInit(): void {}

  public async exportData() {
    await this.dataExportService.exportAllAndShare();
    this.matDialogRef.close();
  }

  public async getBackupFileConsideringPlatform() {
    const deviceInfo = await Device.getInfo();

    switch (deviceInfo.platform) {
      case 'ios': {
        this.selectBackup();
        break;
      }
      case 'android': {
        this.selectBackup();
        break;
      }
      default: {
        this.syncFileChooser.nativeElement.click();
      }
    }
  }

  public async selectBackup() {
    const selectedFile = await FileSelector.fileSelector({
      multiple_selection: false,
      ext: ['*'],
    });

    const deviceInfo = await Device.getInfo();
    let paths;

    if (deviceInfo.platform === 'ios') {
      paths = selectedFile.paths;
    } else if (deviceInfo.platform === 'android') {
      paths = JSON.parse(selectedFile.paths);
    }

    if (selectedFile.extensions.includes('territoryoffline')) {
      const file = await fetch(paths[0]).then((r) => r.blob());
      this.importFile({ target: { files: [file] } });
    } else {
      alert(this.translateService.instant('territories.wrongFileType'));
    }
  }

  public importFile(event) {
    const jsonReader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      jsonReader.onload = () =>
        this.jsonSyncFileOnload(jsonReader.result as any).catch((e) => {
          console.log('Keine JSON Struktur.', e);
          const binaryFileReader = new FileReader();
          binaryFileReader.onload = () =>
            this.dataImportService.importBackupBinary(binaryFileReader.result);
          binaryFileReader.readAsArrayBuffer(file);
        });

      jsonReader.readAsText(file);
    }
  }

  private async jsonSyncFileOnload(data: any) {
    const json = JSON.parse(data);
    await this.dataImportService.importBackup(json);
    this.matDialogRef.close();
  }
}
