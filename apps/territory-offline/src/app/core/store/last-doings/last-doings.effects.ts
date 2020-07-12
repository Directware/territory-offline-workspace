import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap, tap} from 'rxjs/operators';
import {TimedEntity} from '../../model/db/timed-entity.interface';
import {from} from 'rxjs';
import {DatabaseService} from '../../services/db/database.service';
import {
  DeleteLastDoing,
  DeleteLastDoingSuccess,
  LoadLastDoings,
  LoadLastDoingsSuccess,
  UpsertLastDoing,
  UpsertLastDoingSuccess
} from './last-doings.actions';
import {LastDoing} from './model/last-doing.model';
import {LastDoingsService} from "../../services/common/last-doings.service";

@Injectable({providedIn: 'root'})
export class LastDoingsEffects
{
  private readonly lastDoingCollectionName = btoa('lastDoings');

  private loadLastDoings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadLastDoings),
      map((action) => this.database.load(this.lastDoingCollectionName)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((lastDoings: LastDoing[]) => LoadLastDoingsSuccess({lastDoings: lastDoings}))
    )
  );

  private upsertLastDoing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertLastDoing),
      map((action) => this.database.upsert(this.lastDoingCollectionName, action.lastDoing)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      tap(() => setTimeout(() => this.lastDoingsService.tidyUpLastDoings(), 0)),
      map((lastDoing: LastDoing) => UpsertLastDoingSuccess({lastDoing: lastDoing}))
    )
  );

  private deleteLastDoing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteLastDoing),
      map((action) => this.database.delete(this.lastDoingCollectionName, action.lastDoing)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((lastDoing: LastDoing) => DeleteLastDoingSuccess({lastDoing: lastDoing}))
    )
  );

  constructor(private actions$: Actions,
              private lastDoingsService: LastDoingsService,
              private database: DatabaseService)
  {
  }
}
