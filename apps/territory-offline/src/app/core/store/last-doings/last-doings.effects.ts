import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap, tap} from 'rxjs/operators';
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
import {LastDoingsService} from "../../services/common/last-doings.service";
import {HASHED_LAST_DOING_TABLE_NAME, LastDoing, TimedEntity} from "@territory-offline-workspace/shared-interfaces";

@Injectable({providedIn: 'root'})
export class LastDoingsEffects
{
  private loadLastDoings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadLastDoings),
      map((action) => this.database.load(HASHED_LAST_DOING_TABLE_NAME)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((lastDoings: LastDoing[]) => LoadLastDoingsSuccess({lastDoings: lastDoings}))
    )
  );

  private upsertLastDoing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertLastDoing),
      map((action) => this.database.upsert(HASHED_LAST_DOING_TABLE_NAME, action.lastDoing)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      tap(() => setTimeout(() => this.lastDoingsService.tidyUpLastDoings(), 0)),
      map((lastDoing: LastDoing) => UpsertLastDoingSuccess({lastDoing: lastDoing}))
    )
  );

  private deleteLastDoing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteLastDoing),
      map((action) => this.database.delete(HASHED_LAST_DOING_TABLE_NAME, action.lastDoing)),
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
