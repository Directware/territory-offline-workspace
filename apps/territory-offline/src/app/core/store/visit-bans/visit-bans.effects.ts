import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap, tap} from 'rxjs/operators';
import {from} from 'rxjs';
import {DatabaseService} from '../../services/db/database.service';
import {
  BulkImportVisitBans,
  BulkImportVisitBansSuccess,
  DeleteVisitBan,
  DeleteVisitBanSuccess,
  LoadVisitBans,
  LoadVisitBansSuccess,
  UpsertVisitBan,
  UpsertVisitBanSuccess
} from './visit-bans.actions';
import {LastDoingsService} from "../../services/common/last-doings.service";
import {
  HASHED_VISIT_BAN_TABLE_NAME,
  LastDoingActionsEnum,
  TimedEntity,
  VisitBan
} from "@territory-offline-workspace/api";

@Injectable({providedIn: 'root'})
export class VisitBansEffects
{
  private loadVisitBans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadVisitBans),
      map((action) => this.database.load(HASHED_VISIT_BAN_TABLE_NAME)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((visitBans: VisitBan[]) => LoadVisitBansSuccess({visitBans: visitBans}))
    )
  );

  private upsertVisitBan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertVisitBan),
      map((action) => this.database.upsert(HASHED_VISIT_BAN_TABLE_NAME, action.visitBan)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((visitBan: VisitBan) => UpsertVisitBanSuccess({visitBan: visitBan}))
    )
  );

  private bulkImportVisitBans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkImportVisitBans),
      map((action) => this.database.bulkUpsert(HASHED_VISIT_BAN_TABLE_NAME, action.visitBans)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((visitBans: VisitBan[]) => BulkImportVisitBansSuccess({visitBans: visitBans}))
    )
  );

  private deleteVisitBan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteVisitBan),
      map((action) => this.database.delete(HASHED_VISIT_BAN_TABLE_NAME, action.visitBan)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      tap((visitBan: VisitBan) => this.lastDoingsService.createLastDoing(LastDoingActionsEnum.DELETE, visitBan.street + " " + visitBan.streetSuffix)),
      map((visitBan: VisitBan) => DeleteVisitBanSuccess({visitBan: visitBan}))
    )
  );

  constructor(private actions$: Actions,
              private database: DatabaseService,
              private lastDoingsService: LastDoingsService) {}
}
