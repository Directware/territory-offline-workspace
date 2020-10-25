import { TranslateService } from '@ngx-translate/core';
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
import {UpsertVisitBan} from "../../store/visit-bans/visit-bans.actions";

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService
{
  constructor(private store: Store<ApplicationState>,
              private lastDoingsService: LastDoingsService,
              private territoryMapsService: TerritoryMapsService,
              private actions$: Actions,
              private translate: TranslateService)
  {
  }

  public async sendToPublisher(assignment: Assignment)
  {
    const territory: Territory = await this.store.pipe(select(selectTerritoryById, assignment.territoryId), first()).toPromise();
    const publisher: Publisher = await this.store.pipe(select(selectPublisherById, assignment.publisherId), first()).toPromise();
    const drawing = await this.store.pipe(select(selectDrawingById, territory.territoryDrawingId), first()).toPromise();
    const visitBans = await this.store.pipe(select(selectVisitBansByTerritoryId, territory.id), first()).toPromise();
    const settings: SettingsState = await this.store.pipe(select(selectSettings), first()).toPromise();
    const translations = await this.translate.get(['assignments.digitalTerritory', 'assignments.sharingFailed', 'assignments.new', 'assignments.body'], {firstName: publisher.firstName}).toPromise();

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
        chooserTitle: translations['assignments.digitalTerritory']
      }
    }).catch(error => console.error(translations['assignments.sharingFailed'], error.message));

    if (deviceInfo.platform !== "ios" && deviceInfo.platform !== "android")
    {
      const subject = `${translations['assignments.new']} - ${territory.key} ${territory.name}`;
      const body = `{{ 'assignments.body' | translate }}`;
      const mailto = `mailto:${publisher.email}?subject=${subject}&body=${body}`;
      window.location.href = encodeURI(mailto);
    }
  }

  public giveBackNow(assignment: Assignment)
  {
    this.translate.get('assignments.return').pipe(take(1)).subscribe((translation: string) => {
      const resp = confirm(translation);

      if (resp)
      {
        this.createLastDoingAndUpdateStatus(assignment, LastDoingActionsEnum.ASSIGN_RETURN);
        this.giveBack(assignment);
      }
    })
  }

  public giveBackFromFieldCompanion(territoryCard: TerritoryCard)
  {
    this.translate.get('assignments.returnFromFieldCompanion', {key: territoryCard.territory.key, name: territoryCard.territory.name}).pipe(take(1)).subscribe((translation: string) => {
      const resp = confirm(translation);

      if (resp)
      {
        this.createLastDoingAndUpdateStatus(territoryCard.assignment, LastDoingActionsEnum.ASSIGN_RETURN);
        this.giveBack(territoryCard.assignment);
        territoryCard.visitBans.forEach(visitBan => this.store.dispatch(UpsertVisitBan({visitBan})));
      }
    });
  }

  public giveBackAndAssign(assignment: Assignment)
  {
    this.translate.get('assignments.proceed').pipe(take(1)).subscribe((translation: string) => {
      const resp = confirm(translation);

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
    });
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
