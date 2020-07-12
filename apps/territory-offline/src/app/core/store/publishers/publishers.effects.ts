import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap, tap} from 'rxjs/operators';
import {TimedEntity} from '../../model/db/timed-entity.interface';
import {from} from 'rxjs';
import {DatabaseService} from '../../services/db/database.service';
import {
  BulkImportPublishers, BulkImportPublishersSuccess, BulkUpsertPublisher, BulkUpsertPublisherSuccess,
  DeletePublisher,
  DeletePublisherSuccess,
  LoadPublishers,
  LoadPublishersSuccess,
  UpsertPublisher,
  UpsertPublisherSuccess
} from './publishers.actions';
import {Publisher} from './model/publisher.model';
import {LastDoingsService} from "../../services/common/last-doings.service";
import {LastDoingActionsEnum} from "../last-doings/model/last-doing-actions.enum";

@Injectable({providedIn: 'root'})
export class PublishersEffects
{
  private readonly publisherCollectionName = btoa('publishers');

  private loadPublishers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadPublishers),
      map((action) => this.database.load(this.publisherCollectionName)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((publishers: Publisher[]) => LoadPublishersSuccess({publishers: publishers}))
    )
  );

  private upsertPublisher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertPublisher),
      map((action) => this.database.upsert(this.publisherCollectionName, action.publisher)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((publisher: Publisher) => UpsertPublisherSuccess({publisher: publisher}))
    )
  );

  private bulkUpsertPublisher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkUpsertPublisher),
      map((action) => this.database.bulkUpsert(this.publisherCollectionName, action.publisher)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((publisher: Publisher[]) => BulkUpsertPublisherSuccess({publisher: publisher}))
    )
  );

  private bulkImportPublishers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkImportPublishers),
      map((action) => this.database.bulkUpsert(this.publisherCollectionName, action.publishers)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((publishers: Publisher[]) => BulkImportPublishersSuccess({publishers: publishers}))
    )
  );

  private deletePublisher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeletePublisher),
      map((action) => this.database.delete(this.publisherCollectionName, action.publisher)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      tap((publisher: Publisher) => this.lastDoingsService.createLastDoing(LastDoingActionsEnum.DELETE, publisher.firstName + " " + publisher.name)),
      map((publisher: Publisher) => DeletePublisherSuccess({publisher: publisher}))
    )
  );

  constructor(private actions$: Actions,
              private database: DatabaseService,
              private lastDoingsService: LastDoingsService)
  {
  }
}
