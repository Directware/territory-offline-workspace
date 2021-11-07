import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import {
  BulkImportTerritoryCards,
  BulkImportTerritoryCardsSuccess,
  DeleteTerritoryCard,
  DeleteTerritoryCardSuccess,
  LoadTerritoryCards,
  LoadTerritoryCardsSuccess,
  UpsertTerritoryCard,
  UpsertTerritoryCardSuccess,
} from './territory-card.actions';
import { AppDatabaseService } from '../../services/database/app-database.service';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../index.reducers';
import {
  TerritoryCard,
  territoryCardCollectionName,
  TimedEntity,
} from '@territory-offline-workspace/shared-interfaces';

@Injectable({ providedIn: 'root' })
export class TerritoryCardEffects {
  private loadTerritoryCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadTerritoryCards),
      map((action) => this.database.load(territoryCardCollectionName)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((territoryCards: TerritoryCard[]) => LoadTerritoryCardsSuccess({ territoryCards }))
    )
  );

  private upsertTerritoryCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertTerritoryCard),
      map((action) => this.database.upsert(territoryCardCollectionName, action.territoryCard)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((territoryCard: TerritoryCard) => UpsertTerritoryCardSuccess({ territoryCard }))
    )
  );

  private bulkImportTerritoryCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkImportTerritoryCards),
      map((action) => this.database.bulkUpsert(territoryCardCollectionName, action.territoryCards)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((territoryCards: TerritoryCard[]) => BulkImportTerritoryCardsSuccess({ territoryCards }))
    )
  );

  private deleteTerritoryCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteTerritoryCard),
      map((action) => this.database.delete(territoryCardCollectionName, action.territoryCard)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((territoryCard: TerritoryCard) => DeleteTerritoryCardSuccess({ territoryCard }))
    )
  );

  constructor(
    private store: Store<ApplicationState>,
    private actions$: Actions,
    private database: AppDatabaseService
  ) {}
}
