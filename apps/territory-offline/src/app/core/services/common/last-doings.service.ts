import {Injectable} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../store/index.reducers";
import {Actions, ofType} from "@ngrx/effects";
import {map, take, tap} from "rxjs/operators";
import {DeleteLastDoing, UpsertLastDoing} from "../../store/last-doings/last-doings.actions";
import { v4 as uuid4 } from 'uuid';
import {selectLastDoingsForTidyUp} from "../../store/last-doings/last-doings.selectors";
import {LastDoing, LastDoingActionsEnum} from "@territory-offline-workspace/shared-interfaces";

@Injectable({
  providedIn: 'root'
})
export class LastDoingsService
{
  private readonly MAX_LAST_DOINGS_COUNT = 12;

  constructor(private store: Store<ApplicationState>,
              private actions$: Actions)
  {
  }

  public tidyUpLastDoings()
  {
    this.store.pipe(
      select(selectLastDoingsForTidyUp),
      take(1),
      map((lastDoings) => lastDoings.slice(this.MAX_LAST_DOINGS_COUNT, lastDoings.length)),
      tap((lastDoings: LastDoing[]) => lastDoings.forEach(ld => this.store.dispatch(DeleteLastDoing({lastDoing: ld}))))
    ).subscribe()
  }

  public createLastDoing(action: LastDoingActionsEnum, label: string)
  {
    this.create({
      id: uuid4(),
      action: action,
      label: label,
      creationTime: new Date()
    });
  }

  public createLastDoingAfter(successActionType: any, action: LastDoingActionsEnum, label: string)
  {
    this.actions$
      .pipe(
        ofType(successActionType),
        take(1),
        tap(() => this.create({
          id: uuid4(),
          action: action,
          label: label,
          creationTime: new Date()
        }))
      ).subscribe();
  }

  private create(lastDoing: LastDoing)
  {
    this.store.dispatch(UpsertLastDoing({lastDoing: lastDoing}));
  }
}
