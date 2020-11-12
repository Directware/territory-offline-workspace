import { selectCongregationById, selectCurrentCongregation } from './congregations.selectors';
import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatMap, map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {from, of} from 'rxjs';
import {DatabaseService} from '../../services/db/database.service';
import {
  DeleteCongregation,
  DeleteCongregationSuccess,
  LoadCongregations,
  LoadCongregationsSuccess,
  UpsertCongregation,
  UpsertCongregationSuccess,
  UseCongregation
} from './congregations.actions';
import {Congregation, LastDoingActionsEnum, TimedEntity} from "@territory-offline-workspace/api";
import {select, Store} from '@ngrx/store';
import {selectSettings} from '../settings/settings.selectors';
import {UpsertSettings, UpsertSettingsSuccess} from '../settings/settings.actions';
import {ApplicationState} from '../index.reducers';
import {LastDoingsService} from "../../services/common/last-doings.service";
import {PlatformAgnosticActionsService} from "../../services/common/platform-agnostic-actions.service";
import {MatDialog} from "@angular/material/dialog";
import {WaitingModalComponent} from "../../../views/shared/modals/waiting-modal/waiting-modal.component";
import { TranslateService } from '@ngx-translate/core';
import {HASHED_CONGREGATION_TABLE_NAME} from "../../services/db/mobile-db-schemas/schemas.db";

@Injectable({providedIn: 'root'})
export class CongregationsEffects
{
  private loadCongregations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadCongregations),
      map((action) => this.database.load(HASHED_CONGREGATION_TABLE_NAME, true)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((congregations: Congregation[]) => LoadCongregationsSuccess({congregations: congregations}))
    )
  );

  private upsertCongregation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertCongregation),
      map((action) => this.database.upsert(HASHED_CONGREGATION_TABLE_NAME, action.congregation, true)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((congregation: Congregation) => UpsertCongregationSuccess({congregation: congregation}))
    )
  );

  public useCongregation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UseCongregation),
      concatMap(action => of(action).pipe(
        withLatestFrom(this.store.pipe(select(selectSettings)), this.store.pipe(select(selectCurrentCongregation))),
      )),
      tap(([action, settings, congregation]) =>
      {
        if(congregation && congregation.languageCode) {
          this.translate.use(congregation.languageCode);
        }

        if (action.congregationId !== settings.currentCongregationId)
        {
          this.actions$
            .pipe(
              ofType(UpsertSettingsSuccess),
              take(1),
              tap(() => this.platformAgnosticActionsService.restartApp()),
            ).subscribe();

          this.store.dispatch(UpsertSettings({settings: {...settings, currentCongregationId: action.congregationId}}));
        }
      })
    ), {dispatch: false});

  private deleteCongregation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteCongregation),
      tap(() => this.dialog.open(WaitingModalComponent, {disableClose: true})),
      map((action) => this.database.delete(HASHED_CONGREGATION_TABLE_NAME, action.congregation, true)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      tap((congregation: Congregation) => this.lastDoingsService.createLastDoing(LastDoingActionsEnum.DELETE, congregation.name)),
      map((congregation: Congregation) => this.database.clearAllWithPrefix(congregation.id)),
      switchMap((promise: Promise<string>) => from(promise)),
      tap(() => this.dialog.closeAll()),
      map((congregationId: string) => DeleteCongregationSuccess({congregationId: congregationId}))
    )
  );

  constructor(private actions$: Actions,
              private store: Store<ApplicationState>,
              private database: DatabaseService,
              private dialog: MatDialog,
              private platformAgnosticActionsService: PlatformAgnosticActionsService,
              private lastDoingsService: LastDoingsService,
              private translate: TranslateService)
  {
  }
}
