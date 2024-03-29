import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import {
  Drawing,
  Territory,
  TerritoryCard,
} from "@territory-offline-workspace/shared-interfaces";
import * as Pako from "pako";
import { Observable } from "rxjs";
import { first, map, take, tap } from "rxjs/operators";
import * as tokml from "tokml";
import { v4 as uuid4 } from "uuid";
import { TerritoryWebTerritories } from "../../../../../../libs/shared-interfaces/src/lib/territory-offline/territory-web/territory-web.territories";
import { AssignmentsService } from "../../core/services/assignment/assignments.service";
import { FileLoaderService } from "../../core/services/common/file/file-loader.service";
import { PlatformAgnosticActionsService } from "../../core/services/common/platform-agnostic-actions.service";
import { ExcelDataExportService } from "../../core/services/export/excel-data-export.service";
import { PdfDataExportService } from "../../core/services/export/pdf-data-export.service";
import { DataExportService } from "../../core/services/import/data-export.service";
import { DataImportService } from "../../core/services/import/data-import.service";
import { GeoJsonParseService } from "../../core/services/territory/geo-json-parse.service";
import { selectCurrentCongregation } from "../../core/store/congregation/congregations.selectors";
import {
  BulkImportDrawings,
  BulkImportDrawingsSuccess,
} from "../../core/store/drawings/drawings.actions";
import { wholeTerritory } from "../../core/store/drawings/drawings.selectors";
import { ApplicationState } from "../../core/store/index.reducers";
import { BulkUpsertTerritory } from "../../core/store/territories/territories.actions";
import { selectAllTerritories } from "../../core/store/territories/territories.selectors";
import { ImportFromExcelModalComponent } from "./import-from-excel-modal/import-from-excel-modal.component";
import { SyncDataComponent } from "./sync-data/sync-data.component";
import { TerritoryHelperImportComponent } from "./territory-helper-import/territory-helper-import.component";

@Component({
  selector: "app-transfer",
  templateUrl: "./transfer.component.html",
  styleUrls: ["./transfer.component.scss"],
})
export class TransferComponent implements OnInit {
  public congregationName$: Observable<string>;

  constructor(
    private router: Router,
    private actions: Actions,
    private excelDataExportService: ExcelDataExportService,
    private store: Store<ApplicationState>,
    private assignmentsService: AssignmentsService,
    private dataExportService: DataExportService,
    private dataImportService: DataImportService,
    private platformAgnosticActionsService: PlatformAgnosticActionsService,
    private pdfDataExportService: PdfDataExportService,
    private matDialog: MatDialog,
    private fileLoaderService: FileLoaderService,
    private translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.congregationName$ = this.store.pipe(
      select(selectCurrentCongregation),
      map((congregation) => congregation.name)
    );
    this.router.navigate([{ outlets: { "second-thread": null } }]);
  }

  public openSyncDialog() {
    this.matDialog.open(SyncDataComponent);
  }

  public showTerritoryHelperImportDialog() {
    this.matDialog.open(TerritoryHelperImportComponent);
  }

  public async exportToBackupFile() {
    await this.dataExportService.exportAllAndShare();
  }

  public exportToGroupOverseer() {
    this.router.navigate([
      { outlets: { "second-thread": "group-overseer-report" } },
    ]);
  }

  public exportS13CurrentServiceYear() {
    const today = new Date();
    this.pdfDataExportService.exportNewS13(today);
  }

  public exportS13LastServiceYear() {
    const today = new Date();
    // prettier-ignore
    this.pdfDataExportService.exportNewS13(new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()), false);
  }

  public exportWholeMap() {
    const today = new Date();
    this.store
      .pipe(
        select(wholeTerritory),
        take(1),
        tap((data) => {
          if (!data || !data.mergedDrawings) {
            this.translate
              .get("transfer.export.noTerritories")
              .pipe(take(1))
              .subscribe((translation: string) => alert(translation));
            return;
          }

          data.mergedDrawings.featureCollection.features.forEach((f) => {
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

          const fileName = `${data.congregation} - ${today.getDate()}-${
            today.getMonth() + 1
          }-${today.getFullYear()}.kml`;
          const kml = tokml(data.mergedDrawings.featureCollection, {
            documentName: fileName,
            name: "description", // property name of geojson properties that should be export als name
          });

          this.platformAgnosticActionsService.share(kml, fileName);
        })
      )
      .subscribe();
  }

  public exportVisitBans() {
    this.excelDataExportService.exportVisitBans();
  }

  public exportPublishers() {
    this.excelDataExportService.exportPublishers();
  }

  public exportTerritories() {
    this.excelDataExportService.exportTerritories();
  }

  public exportTerritoryState() {
    this.excelDataExportService.exportTerritoryState();
  }

  public importFromExcel(type: string) {
    this.matDialog.open(ImportFromExcelModalComponent, {
      width: "37.5rem",
      minHeight: "37.25rem",
      panelClass: "excel-import-dialog",
      data: {
        importType: type,
      },
    });
  }

  public importTerritoryFromFieldCompanion(event) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      const binaryFileReader = new FileReader();
      binaryFileReader.onload = () =>
        this.readBinaryFile(binaryFileReader.result as any);
      binaryFileReader.readAsArrayBuffer(file);
    }
  }

  public async importAnyData(event) {
    if (event.target.files && event.target.files.length) {
      const territories = await this.store
        .pipe(select(selectAllTerritories), first())
        .toPromise();
      const [file] = event.target.files;
      const jsonFileReader = new FileReader();
      jsonFileReader.onload = () => {
        const json = JSON.parse(
          jsonFileReader.result + ""
        ) as TerritoryWebTerritories;
        console.log(json, json.features.length);

        let i = 0;
        const territoriesToUpdate = [];
        json.features.forEach((data) => {
          if (data.properties.description) {
            const test =
              data.properties.TerritoryTypeCode +
              " " +
              data.properties.TerritoryNumber;
            const test2 = data.properties.TerritoryType;

            const we = parseInt(
              data.properties.description.replace("WE ", ""),
              10
            );
            const territory = territories.filter(
              (ter) => ter.key === test && ter.name === test2
            )[0];
            console.log(test2 + " " + test + " | " + we, territory);
            territoriesToUpdate.push({
              ...territory,
              populationCount: we,
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

  private async readBinaryFile(data: any) {
    const unGzippedData = Pako.ungzip(data, { to: "string" });
    const json: TerritoryCard = JSON.parse(unGzippedData);
    this.assignmentsService.giveBackFromFieldCompanion(json);
  }

  public importGeoJson(event: Event) {
    this.fileLoaderService.openFile(event).readJson(async (fileContent) => {
      const parser = new GeoJsonParseService();
      if (parser.isGEOJsonSchema(fileContent)) {
        this.router.navigate([
          { outlets: { "second-thread": "transfer/import-geo-json" } },
        ]);
      } else {
        alert("No GEO Json Format!");
      }
    });
  }

  public importTerritoriesFromKML(event: Event) {
    this.fileLoaderService.openFile(event).readText((fileContent) => {
      const parser = new DOMParser();
      const parsedXml = parser.parseFromString(fileContent, "text/xml");
      const placemarks = parsedXml.getElementsByTagName("Placemark");
      const drawings: Drawing[] = [];
      const territories: Territory[] = [];

      for (let placemark of placemarks) {
        const territoryId = uuid4();
        const drawingId = uuid4();

        const territoryNumber =
          placemark.getElementsByTagName("name")[0].innerHTML;
        const territoryName =
          placemark.getElementsByTagName("description")[0].innerHTML;
        const drawing =
          placemark.getElementsByTagName("coordinates")[0].innerHTML;

        const coordinates = drawing
          .split(" ")
          .map((entry) => entry.split(",").map((e) => parseFloat(e)));

        drawings.push({
          id: drawingId,
          featureCollection: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [coordinates],
                },
                properties: {
                  prop0: "value0",
                  prop1: 0.0,
                },
              },
            ],
          },
          creationTime: new Date(),
        });

        territories.push({
          id: territoryId,
          key: territoryNumber,
          name: territoryName,
          populationCount: 0,
          tags: [],
          territoryDrawingId: drawingId,
          boundaryNames: [],
          creationTime: new Date(),
        });
      }

      this.actions
        .pipe(ofType(BulkImportDrawingsSuccess), first())
        .subscribe(() => {
          this.store.dispatch(BulkUpsertTerritory({ territories }));
        });

      this.store.dispatch(BulkImportDrawings({ drawings }));
    });
  }
}
