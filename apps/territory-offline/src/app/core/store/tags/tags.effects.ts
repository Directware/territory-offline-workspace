import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap, tap} from 'rxjs/operators';
import {from} from 'rxjs';
import {DatabaseService} from '../../services/db/database.service';
import {DeleteTag, DeleteTagSuccess, LoadTags, LoadTagsSuccess, UpsertTag, UpsertTagSuccess} from './tags.actions';
import {BulkImportTags, BulkImportTagsSuccess} from '../tags/tags.actions';
import {LastDoingsService} from "../../services/common/last-doings.service";
import {LastDoingActionsEnum, Tag, TimedEntity} from "@territory-offline-workspace/api";

@Injectable({providedIn: 'root'})
export class TagsEffects
{
  private readonly tagCollectionName = btoa('tags');

  private loadTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadTags),
      map((action) => this.database.load(this.tagCollectionName)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((tags: Tag[]) => LoadTagsSuccess({tags: tags}))
    )
  );

  private UpsertTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertTag),
      map((action) => this.database.upsert(this.tagCollectionName, action.tag)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((tag: Tag) => UpsertTagSuccess({tag: tag}))
    )
  );

  private bulkImportTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkImportTags),
      map((action) => this.database.bulkUpsert(this.tagCollectionName, action.tags)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((tags: Tag[]) => BulkImportTagsSuccess({tags: tags}))
    )
  );

  private deleteTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteTag),
      map((action) => this.database.delete(this.tagCollectionName, action.tag)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      tap((tag: Tag) => this.lastDoingsService.createLastDoing(LastDoingActionsEnum.DELETE, tag.name)),
      map((tag: Tag) => DeleteTagSuccess({tag: tag}))
    )
  );

  constructor(private actions$: Actions,
              private database: DatabaseService,
              private lastDoingsService: LastDoingsService)
  {
  }
}
