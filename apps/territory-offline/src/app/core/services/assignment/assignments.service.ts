import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {UpsertAssignment, UpsertAssignmentSuccess} from './../../../core/store/assignments/assignments.actions';
import {v4 as uuid} from 'uuid';
import {Actions, ofType} from '@ngrx/effects';
import {first, take, tap} from 'rxjs/operators';
import {LastDoingsService} from "../common/last-doings.service";
import {selectTerritoryById} from "../../store/territories/territories.selectors";
import {TerritoryMapsService} from "../territory/territory-maps.service";
import {ApplicationState} from "../../store/index.reducers";
import {selectPublisherById} from "../../store/publishers/publishers.selectors";
import {Plugins} from '@capacitor/core';
import {FileSharer} from "@byteowls/capacitor-filesharer";

const {Device} = Plugins;
import * as Pako from 'pako';
import {selectDrawingById} from "../../store/drawings/drawings.selectors";
import {selectVisitBansByTerritoryId} from "../../store/visit-bans/visit-bans.selectors";
import {selectSettings} from "../../store/settings/settings.selectors";
import {SettingsState} from "../../store/settings/settings.reducer";
import {
  Assignment,
  ExportableTypesEnum,
  LastDoingActionsEnum,
  Publisher,
  Territory,
  TerritoryCard
} from "@territory-offline-workspace/api";

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService
{
  constructor(private store: Store<ApplicationState>,
              private lastDoingsService: LastDoingsService,
              private territoryMapsService: TerritoryMapsService,
              private actions$: Actions)
  {
  }

  public async sendToPublisher(assignment: Assignment)
  {
    const territory: Territory = await this.store.pipe(select(selectTerritoryById, assignment.territoryId), first()).toPromise();
    const publisher: Publisher = await this.store.pipe(select(selectPublisherById, assignment.publisherId), first()).toPromise();
    const drawing = await this.store.pipe(select(selectDrawingById, territory.territoryDrawingId), first()).toPromise();
    const visitBans = await this.store.pipe(select(selectVisitBansByTerritoryId, territory.id), first()).toPromise();
    const settings: SettingsState = await this.store.pipe(select(selectSettings), first()).toPromise();

    const deviceInfo = await Device.getInfo();

    const digitalTerritoryCard: TerritoryCard = {
      id: uuid(),
      territory: territory,
      drawing: drawing,
      publisher: publisher,
      assignment: assignment,
      visitBans: visitBans,
      type: ExportableTypesEnum.DIGITAL_TERRITORY,
      estimationInMonths: settings.processingPeriodInMonths,
      creationTime: new Date()
    };

    const gzippedData = Pako.gzip(JSON.stringify(digitalTerritoryCard), {to: "string"});

    await FileSharer.share({
      filename: `${territory.key} ${territory.name}.territory`,
      base64Data: btoa(gzippedData),
      contentType: "text/plain;charset=utf-8",
      android: {
        chooserTitle: "Digital Territory"
      }
    }).catch(error => console.error("File sharing failed", error.message));

    if (deviceInfo.platform !== "ios" && deviceInfo.platform !== "android")
    {
      const subject = `Neue Zuteilung - ${territory.key} ${territory.name}`;
      const body = `Hallo ${publisher.firstName},\n\n im Anhang findest du dein neues Gebiet!`;
      const mailto = `mailto:${publisher.email}?subject=${subject}&body=${body}`;
      window.location.href = encodeURI(mailto);
    }
  }

  public giveBackNow(assignment: Assignment)
  {
    const resp = confirm("Möchtest du dieses Gebiet zurückgeben?");

    if (resp)
    {
      this.createLastDoingAndUpdateStatus(assignment, LastDoingActionsEnum.ASSIGN_RETURN);
      this.giveBack(assignment);
    }
  }

  public giveBackAndAssign(assignment: Assignment)
  {
    const resp = confirm("Möchtest du dieses Gebiet als Bearbeitet melden?");

    if (resp)
    {
      this.actions$.pipe(
        ofType(UpsertAssignmentSuccess),
        take(1),
        tap(() => this.createLastDoingAndUpdateStatus(assignment, LastDoingActionsEnum.REASSIGN)),
        tap(() => this.store.dispatch(UpsertAssignment({
          assignment: {
            ...assignment,
            id: uuid(),
            startTime: new Date(),
            endTime: null
          }
        })))
      ).subscribe();

      this.giveBack(assignment);
    }
  }

  private giveBack(assignment: Assignment)
  {
    this.store.dispatch(UpsertAssignment({
      assignment: {
        ...assignment,
        endTime: new Date()
      }
    }));
  }

  private createLastDoingAndUpdateStatus(assignment: Assignment, action: LastDoingActionsEnum)
  {
    this.store
      .pipe(
        select(selectTerritoryById, assignment.territoryId),
        take(1),
        tap((action) => this.territoryMapsService.updateDrawingStatus()),
        tap((territory: Territory) => this.lastDoingsService
          .createLastDoingAfter(UpsertAssignmentSuccess, action, territory.key + " " + territory.name))
      ).subscribe();
  }
}
