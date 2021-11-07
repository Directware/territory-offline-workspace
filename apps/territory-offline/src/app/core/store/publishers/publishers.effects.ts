import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { DatabaseService } from '../../services/db/database.service';
import {
  BulkImportPublishers,
  BulkImportPublishersSuccess,
  BulkUpsertPublisher,
  BulkUpsertPublisherSuccess,
  DeletePublisher,
  DeletePublisherSuccess,
  LoadPublishers,
  LoadPublishersSuccess,
  UpsertPublisher,
  UpsertPublisherSuccess,
} from './publishers.actions';
import { LastDoingsService } from '../../services/common/last-doings.service';
import {
  HASHED_PUBLISHER_TABLE_NAME,
  LastDoingActionsEnum,
  Publisher,
  TimedEntity,
} from '@territory-offline-workspace/shared-interfaces';

@Injectable({ providedIn: 'root' })
export class PublishersEffects {
  private loadPublishers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadPublishers),
      map((action) => this.database.load(HASHED_PUBLISHER_TABLE_NAME)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((publishers: Publisher[]) => LoadPublishersSuccess({ publishers: publishers }))
    )
  );

  private upsertPublisher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertPublisher),
      map((action) => this.database.upsert(HASHED_PUBLISHER_TABLE_NAME, action.publisher)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((publisher: Publisher) => UpsertPublisherSuccess({ publisher: publisher }))
    )
  );

  private bulkUpsertPublisher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkUpsertPublisher),
      map((action) => this.database.bulkUpsert(HASHED_PUBLISHER_TABLE_NAME, action.publisher)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((publisher: Publisher[]) => BulkUpsertPublisherSuccess({ publisher: publisher }))
    )
  );

  private bulkImportPublishers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkImportPublishers),
      map((action) => this.database.bulkUpsert(HASHED_PUBLISHER_TABLE_NAME, action.publishers)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((publishers: Publisher[]) => BulkImportPublishersSuccess({ publishers: publishers }))
    )
  );

  private deletePublisher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeletePublisher),
      map((action) => this.database.delete(HASHED_PUBLISHER_TABLE_NAME, action.publisher)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      tap((publisher: Publisher) =>
        this.lastDoingsService.createLastDoing(
          LastDoingActionsEnum.DELETE,
          publisher.firstName + ' ' + publisher.name
        )
      ),
      map((publisher: Publisher) => DeletePublisherSuccess({ publisher: publisher }))
    )
  );

  constructor(
    private actions$: Actions,
    private database: DatabaseService,
    private lastDoingsService: LastDoingsService
  ) {}
}
