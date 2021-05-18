import {TranslateService} from '@ngx-translate/core';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {UpsertAssignment, UpsertAssignmentSuccess} from './../../../core/store/assignments/assignments.actions';
import {v4 as uuid} from 'uuid';
import {Actions, ofType} from '@ngrx/effects';
import {first, take, tap} from 'rxjs/operators';
import {selectTerritoryById} from "../../store/territories/territories.selectors";
import {ApplicationState} from "../../store/index.reducers";
import {selectPublisherById} from "../../store/publishers/publishers.selectors";
import {Plugins} from '@capacitor/core';
import * as Pako from 'pako';
import {selectDrawingById} from "../../store/drawings/drawings.selectors";
import {selectVisitBansByTerritoryId} from "../../store/visit-bans/visit-bans.selectors";
import {selectSettings} from "../../store/settings/settings.selectors";
import {SettingsState} from "../../store/settings/settings.reducer";
import {
  Assignment,
  ExportableTypesEnum,
  Publisher,
  Territory,
  TerritoryCard
} from "@territory-offline-workspace/shared-interfaces";
import {UpsertVisitBan} from "../../store/visit-bans/visit-bans.actions";
import {selectLastAssignmentOfEachTerritory} from "../../store/assignments/assignments.selectors";
import {PlatformAgnosticActionsService} from "../common/platform-agnostic-actions.service";
import {TerritoryMapsService} from "../territory/territory-maps.service";

const {Device} = Plugins;

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService
{
  constructor(private store: Store<ApplicationState>,
              private actions$: Actions,
              private territoryMapsService: TerritoryMapsService,
              private platformAgnosticActionsService: PlatformAgnosticActionsService,
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
      publisher: {...publisher, dsgvoSignature: null, email: null, phone: null, firstName: null, name: null},
      assignment: assignment,
      visitBans: visitBans,
      type: ExportableTypesEnum.DIGITAL_TERRITORY,
      estimationInMonths: settings.processingPeriodInMonths,
      creationTime: new Date()
    };

    const gzippedData = Pako.gzip(JSON.stringify(digitalTerritoryCard), {to: "string"});

    this.platformAgnosticActionsService.share(gzippedData, `${territory.key} ${territory.name}.territory`, "territory-cards");

    if (deviceInfo.platform !== "ios" && deviceInfo.platform !== "android")
    {
      const subject = `${translations['assignments.new']} - ${territory.key} ${territory.name}`;
      const body = `${translations['assignments.body']}`;
      const mailto = `mailto:${publisher.email}?subject=${subject}&body=${body}`;
      window.location.href = encodeURI(mailto);
    }
  }

  public giveBackNow(assignment: Assignment)
  {
    const resp = confirm(this.translate.instant('assignments.return'));

    if (resp)
    {
      this.giveBack(assignment);
    }
  }

  public async giveBackFromFieldCompanion(territoryCard: TerritoryCard)
  {
    const translation = await this.translate.get('assignments.returnFromFieldCompanion', {
      key: territoryCard.territory.key,
      name: territoryCard.territory.name
    }).pipe(first()).toPromise();

    this.territoryMapsService.focusOnDrawingIds([territoryCard.territory.territoryDrawingId], async () =>
    {
      const resp = confirm(translation);
      if (resp)
      {
        const assignments = await this.store.pipe(select(selectLastAssignmentOfEachTerritory), first()).toPromise();
        const assignment = assignments.filter((a: Assignment) => a.territoryId === territoryCard.territory.id)[0];

        if (territoryCard.assignment.publisherId === assignment.publisherId)
        {
          this.giveBack(assignment);
          territoryCard.visitBans.forEach(visitBan => this.store.dispatch(UpsertVisitBan({visitBan})));
          this.territoryMapsService.focusOnDrawingIds(null);
        }
        else
        {
          alert(`Fehler!`);
        }
      }
      else
      {
        this.territoryMapsService.focusOnDrawingIds(null);
      }
    });
  }

  public async giveBackAndAssign(assignment: Assignment)
  {
    const resp = confirm(this.translate.instant('assignments.proceed'));

    if (resp)
    {
      this.actions$.pipe(
        ofType(UpsertAssignmentSuccess),
        take(1),
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
}
