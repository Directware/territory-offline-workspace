import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileLoaderService } from '../../../core/services/common/file/file-loader.service';
import { GeoJsonParseService } from '../../../core/services/territory/geo-json-parse.service';
import { FeatureCollection } from '@turf/turf';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { BackupImportProgressComponent } from '../../shared/modals/backup-import-progress/backup-import-progress.component';
import { TranslateService } from '@ngx-translate/core';
import { DataImportService } from '../../../core/services/import/data-import.service';

@Component({
  selector: 'to-import-geo-json',
  templateUrl: './import-geo-json.component.html',
  styleUrls: ['./import-geo-json.component.scss'],
})
export class ImportGeoJsonComponent implements OnInit {
  public currentKeyMapping: string;

  public keyMappings = {
    territoryName: {
      translation: 'territory.location',
      propName: null,
    },
    territoryKey: {
      translation: 'territory.number',
      propName: null,
    },
    territoryPCount: {
      translation: 'territory.populationCount',
      propName: null,
    },
  };

  public featurePropertyKeys: string[];
  public featureProperties: any;

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private translate: TranslateService,
    private dataImportService: DataImportService,
    private fileLoaderService: FileLoaderService
  ) {}

  public ngOnInit(): void {
    const parser = new GeoJsonParseService();
    const fileContent = this.fileLoaderService.getFileContent() as FeatureCollection;

    if (parser.isGEOJsonSchema(fileContent)) {
      const polygons = parser.onlyPolygons(fileContent);

      this.featurePropertyKeys = Array.from(Object.keys(polygons[0].properties));
      this.featureProperties = polygons[0].properties;
      this.currentKeyMapping = 'territoryName';
    }
  }

  public back() {
    this.router.navigate([{ outlets: { 'second-thread': null } }]);
  }

  public setMapping(prop: string) {
    this.keyMappings[this.currentKeyMapping]['propName'] = prop;
    const toBeChosen = Object.keys(this.keyMappings)
      .filter((key) => !this.keyMappings[key].propName)
      .map((key) => key);

    this.currentKeyMapping = toBeChosen.length > 0 ? toBeChosen[0] : 'done';
  }

  public setCurrentMapping(mappingName: string) {
    this.currentKeyMapping = mappingName;
  }

  public import() {
    const confirmed = confirm('Möchtest du wirklich importieren?');

    if (confirmed) {
      const parser = new GeoJsonParseService();
      const fileContent = this.fileLoaderService.getFileContent() as FeatureCollection;

      Object.keys(this.keyMappings)
        .filter((key) => this.keyMappings[key].propName === 'ignore')
        .forEach((key) => (this.keyMappings[key].propName = null));

      const result = parser.readGEOJson(fileContent, {
        name: this.keyMappings.territoryName.propName,
        key: this.keyMappings.territoryKey.propName,
        populationCount: this.keyMappings.territoryPCount.propName,
      });

      const territories = result.map((r) => r.t);
      const drawings = result.map((r) => r.d);

      this.showImportDialog(territories, drawings);
    }
  }

  private async showImportDialog(territories, drawings) {
    const translations = await this.translate
      .get([
        'transfer.import.title',
        'transfer.import.ok',
        'transfer.import.territories',
        'transfer.import.drawings',
      ])
      .toPromise();
    const dialogConfig = new MatDialogConfig();
    const progressMsg = new BehaviorSubject({
      label: translations['transfer.import.title'],
      icon: null,
    });

    dialogConfig.disableClose = true;
    dialogConfig.width = '32rem';
    dialogConfig.data = { progressMsg: progressMsg };
    const importProgressDialogRef = this.matDialog.open(
      BackupImportProgressComponent,
      dialogConfig
    );

    progressMsg.next({
      label: `${territories.length} ${translations['transfer.import.territories']}`,
      icon: null,
    });
    await this.dataImportService.importTerritories(territories).toPromise();
    progressMsg.next({ label: translations['transfer.import.ok'], icon: 'check' });
    progressMsg.next({
      label: `${drawings.length} ${translations['transfer.import.drawings']}`,
      icon: null,
    });
    await this.dataImportService.importDrawings(drawings).toPromise();
    progressMsg.next({ label: translations['transfer.import.ok'], icon: 'check' });
    progressMsg.complete();

    importProgressDialogRef.close();

    setTimeout(
      () => this.router.navigate(['/territories', { outlets: { 'second-thread': null } }]),
      300
    );
  }
}
