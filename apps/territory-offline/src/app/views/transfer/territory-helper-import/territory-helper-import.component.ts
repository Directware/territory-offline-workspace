import { take } from 'rxjs/operators';
import {Component, Input, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {DataImportService} from "../../../core/services/import/data-import.service";
import {Router} from "@angular/router";
import { v4 as uuid4 } from 'uuid';
import * as XLSX from 'xlsx';
import {MatDialogRef} from "@angular/material/dialog";
import {
  Assignment,
  Drawing,
  ExportableTypesEnum,
  Publisher,
  Tag,
  TagSymbol,
  Territory,
  VisitBan
} from "@territory-offline-workspace/shared-interfaces";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-territory-helper-import',
  templateUrl: './territory-helper-import.component.html',
  styleUrls: ['./territory-helper-import.component.scss']
})
export class TerritoryHelperImportComponent implements OnInit
{
  @Input()
  public disabledText: boolean;

  @Input()
  public disabledTitle: boolean;

  @Input()
  public disabledButtons: boolean;

  @Input()
  public disabledSkip: boolean;

  public importPending: boolean;
  public importDone: boolean;

  public parsedPreacher: Publisher[] = [];
  public parsedTerritories: Territory[] = [];
  public parsedDrawings: Drawing[] = [];
  public parsedTags: Tag[] = [];
  public parsedAssignments: Assignment[] = [];
  public parsedAddresses: VisitBan[] = [];

  constructor(private store: Store<ApplicationState>,
              private dialogRef: MatDialogRef<TerritoryHelperImportComponent>,
              private dataImportService: DataImportService,
              private router: Router,
              private translate: TranslateService)
  {
  }

  public ngOnInit()
  {
  }

  public importFile($event, type?: string)
  {
    const myReader = new FileReader();
    const file = $event.target.files[0];

    switch (type)
    {
      case "preacher":
        if (file.name.endsWith(".xlsx"))
        {
          myReader.onloadend = () => this.importPreacherResults(myReader.result);
          myReader.readAsBinaryString(file);
        }
        else
        {
          this.translate.get('transfer.import.wrongFileType').pipe(take(1)).subscribe((translation: string) =>
            alert(translation));
        }
        break;
      case "assigment":
        if (file.name.endsWith(".xlsx"))
        {
          myReader.onloadend = () => this.importAssignmentResults(myReader.result);
          myReader.readAsBinaryString(file);
        }
        else
        {
          this.translate.get('transfer.import.wrongFileType').pipe(take(1)).subscribe((translation: string) =>
            alert(translation));
        }
        break;
      case "address":
        if (file.name.endsWith(".xlsx"))
        {
          myReader.onloadend = () => this.importAddressesResults(myReader.result);
          myReader.readAsBinaryString(file);
        }
        else
        {
          this.translate.get('transfer.import.wrongFileType').pipe(take(1)).subscribe((translation: string) =>
            alert(translation));
        }
        break;
      default:
        if (file.name.endsWith(".json"))
        {
          myReader.onloadend = () => this.importTerritoryResults(JSON.parse(<string>myReader.result));
          myReader.readAsText(file);
        }
        else
        {
          this.translate.get('transfer.import.noJsonFile').pipe(take(1)).subscribe((translation: string) =>
            alert(translation));
        }
    }
  }

  public navigateToDashboard()
  {
    this.router.navigate(["dashboard"]);
    this.router.navigate([{outlets: {'aux': null, 'modal': null}}]);
  }

  private importPreacherResults(data: any)
  {
    const workbook = XLSX.read(data, {type: 'binary'});
    workbook.SheetNames.forEach((sheetName) =>
    {
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet["!ref"]);

      for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++)
      {
        if (rowNum === 0)
        {
          continue;
        }

        const firstName = sheet[XLSX.utils.encode_cell({r: rowNum, c: 0})]["w"];
        const name = sheet[XLSX.utils.encode_cell({r: rowNum, c: 1})]["w"];
        const email = sheet[XLSX.utils.encode_cell({r: rowNum, c: 2})]["w"];
        const telefon = sheet[XLSX.utils.encode_cell({r: rowNum, c: 3})]["w"];
        this.parsedPreacher.push({
          id: uuid4(),
          firstName: firstName,
          name: name,
          email: email,
          phone: telefon,
          creationTime: new Date(),
          tags: []
        });
      }
    });
  }

  private importAssignmentResults(data: any)
  {
    const workbook = XLSX.read(data, {type: 'binary'});
    workbook.SheetNames.forEach((sheetName) =>
    {
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet["!ref"]);

      for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++)
      {
        const preacherName = sheet[XLSX.utils.encode_cell({r: rowNum, c: 4})]["w"];
        const territoryName = sheet[XLSX.utils.encode_cell({r: rowNum, c: 0})]["w"];
        const territoryKey = sheet[XLSX.utils.encode_cell({r: rowNum, c: 1})]["w"];
        const startTime = sheet[XLSX.utils.encode_cell({r: rowNum, c: 7})]["w"];
        const stopTime = sheet[XLSX.utils.encode_cell({r: rowNum, c: 8})]["w"];

        const preacher = this.parsedPreacher.filter(p => preacherName.toUpperCase().includes(p.name.toUpperCase()) && preacherName.toUpperCase().includes(p.firstName.toUpperCase()))[0];

        const territory = this.parsedTerritories.filter(t => t.name === territoryName && t.key === territoryKey)[0];
        if (preacher && territory)
        {
          this.parsedAssignments.push({
            id: uuid4(),
            startTime: new Date(startTime),
            endTime: stopTime ? new Date(stopTime) : null,
            publisherId: preacher.id,
            territoryId: territory.id,
            creationTime: new Date(startTime)
          });
        }
      }
    });
  }

  private importTerritoryResults(data: any)
  {
    const tagsToBeCreated = new Map();
    data.features.forEach((dataSet: any) =>
    {
      if (!tagsToBeCreated.has(dataSet.properties.TerritoryType))
      {
        tagsToBeCreated.set(dataSet.properties.TerritoryType, {
          id: uuid4(),
          name: dataSet.properties.TerritoryType,
          symbol: TagSymbol.MAP
        });
      }

      const drawingId = uuid4();
      const territoryId = uuid4();

      this.parsedTerritories.push({
        id: territoryId,
        name: dataSet.properties.TerritoryType || dataSet.properties.name,
        key: dataSet.properties.TerritoryNumber,
        territoryDrawingId: drawingId,
        tags: [tagsToBeCreated.get(dataSet.properties.TerritoryType).id],
        populationCount: 0,
        boundaryNames: null,
        creationTime: new Date()
      });

      this.parsedDrawings.push({
        id: drawingId,
        featureCollection: (<any>[dataSet]),
        creationTime: new Date()
      });
    });

    this.parsedTags = Array.from(tagsToBeCreated.values());
  }

  private importAddressesResults(data: any)
  {
    const relevantTags = new Map();
    const workbook = XLSX.read(data, {type: 'binary'});
    workbook.SheetNames.forEach((sheetName) =>
    {
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet["!ref"]);

      for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++)
      {
        if (rowNum === 0)
        {
          continue;
        }

        const territoryKey = sheet[XLSX.utils.encode_cell({r: rowNum, c: 1})]["w"];
        const territoryName = sheet[XLSX.utils.encode_cell({r: rowNum, c: 0})]["w"];
        const territory = this.parsedTerritories.filter(t => t.key === territoryKey && t.name === territoryName)[0];

        const status = sheet[XLSX.utils.encode_cell({r: rowNum, c: 3})]["w"];
        const latitude = sheet[XLSX.utils.encode_cell({r: rowNum, c: 4})]["w"];
        const longitude = sheet[XLSX.utils.encode_cell({r: rowNum, c: 5})]["w"];
        const streetSuffix = sheet[XLSX.utils.encode_cell({r: rowNum, c: 7})]["w"];
        const street = sheet[XLSX.utils.encode_cell({r: rowNum, c: 8})]["w"];
        const floor = sheet[XLSX.utils.encode_cell({r: rowNum, c: 10})]["w"];
        const city = sheet[XLSX.utils.encode_cell({r: rowNum, c: 11})]["w"];
        const lastVisitDate = sheet[XLSX.utils.encode_cell({r: rowNum, c: 17})]["w"];
        const creationDate = sheet[XLSX.utils.encode_cell({r: rowNum, c: 18})]["w"];

        if (!relevantTags.get(status))
        {
          relevantTags.set(status, {id: uuid4(), name: status, symbol: TagSymbol.HOUSE});
        }

        const tmp: VisitBan = {
          id: uuid4(),
          name: "",
          street: street,
          streetSuffix: streetSuffix,
          creationTime: creationDate ? new Date(creationDate) : null,
          territoryId: territory ? territory.id : "",
          tags: [relevantTags.get(status).id],
          city: city,
          floor: floor,
          lastVisit: lastVisitDate ? new Date(lastVisitDate) : null,
          comment: "",
          gpsPosition: {
            lat: latitude,
            lng: longitude
          },
        };
        this.parsedAddresses.push(tmp);
      }
    });

    this.parsedTags.push(...Array.from(relevantTags.values()));
  }

  public importAll()
  {
    this.dataImportService.importBackup({
      tags: this.parsedTags,
      visitBans: this.parsedAddresses,
      assignments: this.parsedAssignments,
      publisher: this.parsedPreacher,
      territories: this.parsedTerritories,
      drawings: this.parsedDrawings,
      type: ExportableTypesEnum.ALL
    }).then(() => this.dialogRef.close());
  }
}
