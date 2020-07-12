import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from 'src/app/core/store/index.reducers';
import {UpsertAssignment, UpsertAssignmentSuccess} from './../../../core/store/assignments/assignments.actions';
import {Assignment} from '../../store/assignments/model/assignment.model';
import {v4 as uuid} from 'uuid';
import {Actions, ofType} from '@ngrx/effects';
import {take, tap} from 'rxjs/operators';
import {LastDoingActionsEnum} from "../../store/last-doings/model/last-doing-actions.enum";
import {LastDoingsService} from "../common/last-doings.service";
import {selectTerritoryById} from "../../store/territories/territories.selectors";
import {Territory} from "../../store/territories/model/territory.model";
import {TerritoryMapsService} from "../territory/territory-maps.service";

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService
{
  constructor(private store: Store<ApplicationState>,
              private lastDoingsService: LastDoingsService,
              private territoryMapsService: TerritoryMapsService,
              private actions$: Actions)
  {
  }

  public giveBackNow(assignment: Assignment)
  {
    const resp = confirm("Möchtest du dieses Gebiet zurückgeben?");

    if (resp)
    {
      this.createLastDoingAndUpdateStatus(assignment, LastDoingActionsEnum.ASSIGN_RETURN);
      this.giveBack(assignment);
    }
  }

  public giveBackAndAssign(assignment: Assignment)
  {
    const resp = confirm("Möchtest du dieses Gebiet als Bearbeitet melden?");

    if (resp)
    {
      this.actions$.pipe(
        ofType(UpsertAssignmentSuccess),
        take(1),
        tap(() => this.createLastDoingAndUpdateStatus(assignment, LastDoingActionsEnum.REASSIGN)),
        tap(() => this.store.dispatch(UpsertAssignment({
          assignment: {
            ...assignment,
            id: uuid(),
            startTime: new Date(),
            endTime: null
          }
        })))
      ).subscribe();

      this.giveBack(assignment);
    }
  }

  private giveBack(assignment: Assignment)
  {
      this.store.dispatch(UpsertAssignment({
        assignment: {
          ...assignment,
          endTime: new Date()
        }
      }));
  }

  private createLastDoingAndUpdateStatus(assignment: Assignment, action: LastDoingActionsEnum)
  {
    this.store
      .pipe(
        select(selectTerritoryById, assignment.territoryId),
        take(1),
        tap((action) => this.territoryMapsService.updateDrawingStatus()),
        tap((territory: Territory) => this.lastDoingsService
          .createLastDoingAfter(UpsertAssignmentSuccess, action, territory.key + " " + territory.name))
      ).subscribe();
  }
}
