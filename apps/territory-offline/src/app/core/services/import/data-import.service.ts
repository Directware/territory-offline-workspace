import {Injectable} from '@angular/core';
import {Actions, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import {ApplicationState} from '../../store/index.reducers';
import {BulkImportPublishers, BulkImportPublishersSuccess} from '../../store/publishers/publishers.actions';
import {BulkImportAssignments, BulkImportAssignmentsSuccess} from '../../store/assignments/assignments.actions';
import {BulkImportTerritories, BulkImportTerritoriesSuccess} from '../../store/territories/territories.actions';
import {BulkImportDrawings, BulkImportDrawingsSuccess} from '../../store/drawings/drawings.actions';
import {BulkImportTags, BulkImportTagsSuccess} from '../../store/tags/tags.actions';
import {BulkImportVisitBans, BulkImportVisitBansSuccess} from '../../store/visit-bans/visit-bans.actions';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {BackupImportProgressComponent} from "../../../views/shared/modals/backup-import-progress/backup-import-progress.component";
import {LastDoingsService} from "../common/last-doings.service";
import * as Pako from 'pako';
import {selectAllTerritoryEntities} from "../../store/territories/territories.selectors";
import {selectAllDrawingEntities} from "../../store/drawings/drawings.selectors";
import {selectPublisherEntities} from "../../store/publishers/publishers.selectors";
import {selectAllAssignmentEntities} from "../../store/assignments/assignments.selectors";
import {selectAllVisitBanEntities} from "../../store/visit-bans/visit-bans.selectors";
import {selectTagEntities} from "../../store/tags/tags.selectors";
import {BackupImportChangesComponent} from "../../../views/shared/modals/backup-import-changes/backup-import-changes.component";
import {
  Assignment,
  Drawing,
  ExportableTypesEnum,
  LastDoingActionsEnum,
  Publisher, Tag,
  Territory, TimedEntity, ToBackup, ToBackupEntities, VisitBan
} from "@territory-offline-workspace/api";

@Injectable({
  providedIn: 'root'
})
export class DataImportService
{
  public static readonly CONGREGATION_COPY_KEY = "[TO] congr cpy";

  constructor(private store: Store<ApplicationState>,
              private matDialog: MatDialog,
              private lastDoingsService: LastDoingsService,
              private actions$: Actions)
  {
  }

  public checkCongregationCopy()
  {
    setTimeout(() =>
    {
      const dataPackage = localStorage.getItem(DataImportService.CONGREGATION_COPY_KEY);

      if (dataPackage)
      {
        const unGzippedData = Pako.ungzip(dataPackage, {to: "string"});
        const parsedData = JSON.parse(unGzippedData);
        this.importBackup(parsedData)
          .then(() => localStorage.removeItem(DataImportService.CONGREGATION_COPY_KEY));
      }
    }, 0);
  }

  public async importBackup(data: any)
  {
    if (data && data.type === ExportableTypesEnum.ALL)
    {
      const dialogConfig = new MatDialogConfig();
      const progressMsg = new BehaviorSubject({label: "Datenimport beginnt...", icon: null});

      dialogConfig.disableClose = true;
      dialogConfig.width = "32rem";
      dialogConfig.data = {progressMsg: progressMsg};

      const importProgressDialogRef = this.matDialog.open(BackupImportProgressComponent, dialogConfig);
      const start = new Date();

      const filteredImportData: any = await this.filterAlreadyExistingEntriesWithSameValues(data);

      progressMsg.next({label: `${filteredImportData.toBeImported.tags.length} Tags werden importiert...`, icon: null})
      await this.importTags(this.datesFromStringToObject(filteredImportData.toBeImported.tags)).toPromise();
      progressMsg.next({label: "ok", icon: "check"});

      const visitBans = filteredImportData.toBeImported.visitBans || this.repairTo1VisitBans(filteredImportData.toBeImported.addresses);
      await this.importVisitBans(this.datesFromStringToObject(visitBans)).toPromise();
      progressMsg.next({label: `${visitBans.length} nicht besuchen Adressen wurden importiert...`, icon: null})
      progressMsg.next({label: "ok", icon: "check"});

      const assignments = this.repairTo1Assignments(filteredImportData.toBeImported.assignments);
      progressMsg.next({label: `${assignments.length} Zuteilungen werden importiert...`, icon: null})
      await this.importAssignments(this.datesFromStringToObject(assignments)).toPromise();
      progressMsg.next({label: "ok", icon: "check"});

      const publishers = filteredImportData.toBeImported.publisher || filteredImportData.toBeImported.preacher;
      progressMsg.next({label: `${publishers.length} Verkündiger werden importiert...`, icon: null})
      await this.importPublisher(this.datesFromStringToObject(publishers)).toPromise();
      progressMsg.next({label: "ok", icon: "check"});

      progressMsg.next({
        label: `${filteredImportData.toBeImported.territories.length} Gebiete werden importiert...`,
        icon: null
      })
      await this.importTerritories(this.datesFromStringToObject(filteredImportData.toBeImported.territories)).toPromise();
      progressMsg.next({label: "ok", icon: "check"});

      const drawings = this.repairTo1Drawings(filteredImportData.toBeImported.drawings);
      progressMsg.next({label: `${drawings.length} Zeichnungen werden importiert...`, icon: null})
      await this.importDrawings(this.datesFromStringToObject(drawings)).toPromise();
      progressMsg.next({label: "ok", icon: "check"});

      progressMsg.complete();
      this.lastDoingsService.createLastDoing(LastDoingActionsEnum.IMPORT, "Sync")
      console.log(new Date().getTime() - start.getTime());
      importProgressDialogRef.close();

      const backupChangesDialogConfig = new MatDialogConfig();
      backupChangesDialogConfig.data = filteredImportData;
      backupChangesDialogConfig.maxHeight = "75vh";
      backupChangesDialogConfig.width = "31rem";
      backupChangesDialogConfig.disableClose = true;
      backupChangesDialogConfig.panelClass = "backup-changes-dialog";
      this.matDialog.open(BackupImportChangesComponent, backupChangesDialogConfig);
    }
    else
    {
      console.log(data);
      alert('Die Datei scheint nicht ein Backup zu sein.');
    }
  }

  public importPublisher(publishers: Publisher[]): Observable<any>
  {
    return this.bulkImport(publishers, BulkImportPublishers, 'publishers', BulkImportPublishersSuccess);
  }

  public importTerritories(territories: Territory[]): Observable<any>
  {
    return this.bulkImport(territories, BulkImportTerritories, 'territories', BulkImportTerritoriesSuccess);
  }

  public importDrawings(drawings: Drawing[]): Observable<any>
  {
    return this.bulkImport(drawings, BulkImportDrawings, 'drawings', BulkImportDrawingsSuccess);
  }

  public importTags(tags: Tag[]): Observable<any>
  {
    return this.bulkImport(tags, BulkImportTags, 'tags', BulkImportTagsSuccess);
  }

  public importAssignments(assignments: Assignment[]): Observable<any>
  {
    return this.bulkImport(assignments, BulkImportAssignments, 'assignments', BulkImportAssignmentsSuccess);
  }

  public importVisitBans(visitBans: VisitBan[]): Observable<any>
  {
    return this.bulkImport(visitBans, BulkImportVisitBans, 'visitBans', BulkImportVisitBansSuccess);
  }

  private repairTo1Drawings(drawings: any[])
  {
    const to1Drawings = drawings.filter((drawing) => drawing.featureCollection && drawing.featureCollection.length > 0 && !drawing.featureCollection.features);

    if (to1Drawings && to1Drawings.length > 0)
    {
      const repairedDrawings = to1Drawings.map(drawing => ({
        ...drawing,
        featureCollection: {
          type: 'FeatureCollection',
          features: drawing.featureCollection
        }
      }));

      return repairedDrawings;
    }

    return drawings;
  }

  private repairTo1Assignments(assignments: any[])
  {
    for (let i = 0; i < assignments.length; i++)
    {
      if (!!assignments[i].preacherId)
      {
        assignments[i].publisherId = assignments[i].preacherId;
        delete assignments[i].preacherId;
      }
    }

    return [...assignments];
  }

  private repairTo1VisitBans(visitBans: any[])
  {
    const tmp = visitBans.map(vb => ({...vb, name: vb.bellPosition}));

    for (let i = 0; i < tmp.length; i++)
    {
      delete tmp[i].bellPosition;
    }

    return tmp;
  }

  private datesFromStringToObject(data: any[])
  {
    const dateProperties = ["creationTime", "lastUpdated", "startTime", "endTime", "lastPrinting", "lastVisit"];
    for (let i = 0; i < data.length; i++)
    {
      dateProperties.forEach(propName =>
      {
        if (!!data[i][propName])
        {
          data[i][propName] = new Date(data[i][propName]);
        }
      });
    }
    return data;
  }

  private async filterAlreadyExistingEntriesWithSameValues(dataToBeImported: ToBackup)
  {
    const filteredData = {};
    const allData = await combineLatest([
      this.store.pipe(select(selectAllTerritoryEntities), take(1)),
      this.store.pipe(select(selectAllDrawingEntities), take(1)),
      this.store.pipe(select(selectPublisherEntities), take(1)),
      this.store.pipe(select(selectAllAssignmentEntities), take(1)),
      this.store.pipe(select(selectAllVisitBanEntities), take(1)),
      this.store.pipe(select(selectTagEntities), take(1))
    ]).toPromise();

    const alreadyExistingData: ToBackupEntities = {
      territories: allData[0],
      drawings: allData[1],
      publisher: allData[2],
      assignments: allData[3],
      visitBans: allData[4],
      tags: allData[5]
    };

    let potentiallyDeletedEntities = null;

    Object.keys(dataToBeImported)
      .filter(key => key !== "type")
      .forEach(key =>
      {
        /* Datensätze, die da sind und im Import nicht existieren, können gelöscht worden sein */
        const idsToBeImported = dataToBeImported[key].map(entity => entity.id) as string[];

        Object.keys(alreadyExistingData[key])
          .filter(entityId => !idsToBeImported.includes(entityId))
          .forEach(entityId =>
          {
            if (!potentiallyDeletedEntities)
            {
              potentiallyDeletedEntities = {};
            }

            if (!potentiallyDeletedEntities[key])
            {
              potentiallyDeletedEntities[key] = [];
            }

            potentiallyDeletedEntities[key].push(alreadyExistingData[key][entityId]);
          });

        /* Es sollen nur Datensätze importiert werden, die nicht existieren oder aktualisiert sind */
        filteredData[key] = dataToBeImported[key].filter(entityToBeImported =>
        {
          const existingEntity = alreadyExistingData[key][entityToBeImported.id];

          if(!existingEntity)
          {
            return true;
          }

          if (JSON.stringify(existingEntity) !== JSON.stringify(entityToBeImported))
          {
            if (key === "drawings")
            {
              if (JSON.stringify(this.removePropertiesIfIsDrawing(existingEntity)) !== JSON.stringify(this.removePropertiesIfIsDrawing(entityToBeImported)))
              {
                return this.isImportingEntityNewer(existingEntity, entityToBeImported);
              }
            }
            else
            {
              return this.isImportingEntityNewer(existingEntity, entityToBeImported);
            }
          }
        });
      });

    return {
      toBeImported: filteredData,
      potentiallyDeleted: potentiallyDeletedEntities
    };
  }

  private removePropertiesIfIsDrawing(drawing: Drawing): Drawing
  {
    return {
      ...drawing,
      featureCollection: {
        ...drawing.featureCollection,
        features: [...drawing.featureCollection.features.map(f => ({...f, properties: null}))]
      }
    };
  }

  private isImportingEntityNewer(alreadyExistingEntity: TimedEntity, entityToBeImported: TimedEntity)
  {
    if(!alreadyExistingEntity)
    {
      return true;
    }

    const timeA = alreadyExistingEntity.lastUpdated || alreadyExistingEntity.creationTime;
    const timeB = new Date(entityToBeImported.lastUpdated) || new Date(entityToBeImported.creationTime);

    return timeA.getTime() < timeB.getTime();
  }

  private bulkImport(dataToBeImported: any[], importActionType: any, importActionFieldName: string, successActionType: any): Observable<any>
  {
    const subject = new Subject();

    if (dataToBeImported && dataToBeImported.length > 0)
    {
      this.actions$.pipe(
        ofType(successActionType),
        take(1),
        tap(() => subject.next()),
        tap(() => subject.complete())
      ).subscribe();

      this.store.dispatch(importActionType({[importActionFieldName]: dataToBeImported}));
    }
    else
    {
      setTimeout(() =>
      {
        subject.next();
        subject.complete();
      }, 100);
    }

    return subject;
  }
}
