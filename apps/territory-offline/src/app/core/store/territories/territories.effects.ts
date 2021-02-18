import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap, tap} from 'rxjs/operators';
import {from} from 'rxjs';
import {DatabaseService} from '../../services/db/database.service';
import {
  BulkImportTerritories,
  BulkImportTerritoriesSuccess, BulkUpsertTerritory, BulkUpsertTerritorySuccess,
  DeleteTerritory,
  DeleteTerritorySuccess,
  LoadTerritories,
  LoadTerritoriesSuccess,
  UpsertTerritory,
  UpsertTerritorySuccess
} from './territories.actions';
import {LastDoingsService} from "../../services/common/last-doings.service";
import {
  HASHED_TERRITORY_TABLE_NAME,
  LastDoingActionsEnum,
  Territory,
  TimedEntity
} from "@territory-offline-workspace/api";

@Injectable({providedIn: 'root'})
export class TerritoriesEffects
{
  private loadTerritories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadTerritories),
      map((action) => this.database.load(HASHED_TERRITORY_TABLE_NAME)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((territories: Territory[]) => LoadTerritoriesSuccess({territories: territories}))
    )
  );

  private upsertTerritories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertTerritory),
      map((action) => this.database.upsert(HASHED_TERRITORY_TABLE_NAME, action.territory)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((territory: Territory) => UpsertTerritorySuccess({territory: territory}))
    )
  );

  private bulkUpsertTerritories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkUpsertTerritory),
      map((action) => this.database.bulkUpsert(HASHED_TERRITORY_TABLE_NAME, action.territories)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((territories: Territory[]) => BulkUpsertTerritorySuccess({territories: territories}))
    )
  );

  private bulkImportTerritories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkImportTerritories),
      map((action) => this.database.bulkUpsert(HASHED_TERRITORY_TABLE_NAME, action.territories)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((territories: Territory[]) => BulkImportTerritoriesSuccess({territories: territories}))
    )
  );

  private deleteTerritory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteTerritory),
      map((action) => this.database.delete(HASHED_TERRITORY_TABLE_NAME, action.territory)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      tap((territory: Territory) => this.lastDoingsService.createLastDoing(LastDoingActionsEnum.DELETE, territory.key + " " + territory.name)),
      map((territory: Territory) => DeleteTerritorySuccess({territory: territory}))
    )
  );

  constructor(private actions$: Actions,
              private database: DatabaseService,
              private lastDoingsService: LastDoingsService)
  {
  }
}
