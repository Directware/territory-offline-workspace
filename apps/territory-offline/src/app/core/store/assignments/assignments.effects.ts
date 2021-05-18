import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatMap, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {from, of} from 'rxjs';
import {DatabaseService} from '../../services/db/database.service';
import {
  BulkUpsertAssignments,
  BulkUpsertAssignmentsSuccess,
  DeleteAssignment,
  DeleteAssignmentsByTerritory,
  DeleteAssignmentsByTerritorySuccess,
  DeleteAssignmentSuccess,
  LoadAssignments,
  LoadAssignmentsSuccess,
  UpsertAssignment,
  UpsertAssignmentSuccess
} from './assignments.actions';
import {BulkImportAssignments, BulkImportAssignmentsSuccess} from '../assignments/assignments.actions';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../index.reducers";
import {selectAssignmentsByTerritoryId} from "./assignments.selectors";
import {
  Assignment,
  HASHED_ASSIGNMENT_TABLE_NAME,
  LastDoingActionsEnum,
  TimedEntity
} from "@territory-offline-workspace/shared-interfaces";
import {selectTerritoryById} from "../territories/territories.selectors";
import {LastDoingsService} from "../../services/common/last-doings.service";
import {UpdateStatusOfDrawings} from "../drawings/drawings.actions";
import {TerritoryMapsService} from "../../services/territory/territory-maps.service";

@Injectable({providedIn: 'root'})
export class AssignmentsEffects
{
  private loadAssignments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadAssignments),
      map((action) => this.database.load(HASHED_ASSIGNMENT_TABLE_NAME)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((assignments: Assignment[]) => LoadAssignmentsSuccess({assignments: assignments}))
    )
  );

  private upsertAssignment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertAssignment),
      map((action) => this.database.upsert(HASHED_ASSIGNMENT_TABLE_NAME, action.assignment)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((assignment: Assignment) => UpsertAssignmentSuccess({assignment: assignment}))
    )
  );

  private bulkUpsertAssignment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkUpsertAssignments),
      map((action) => this.database.bulkUpsert(HASHED_ASSIGNMENT_TABLE_NAME, action.assignments)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((assignments: Assignment[]) => BulkUpsertAssignmentsSuccess({assignments: assignments}))
    )
  );

  private bulkImportAssignments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkImportAssignments),
      map((action) => this.database.bulkUpsert(HASHED_ASSIGNMENT_TABLE_NAME, action.assignments)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((assignments: Assignment[]) => BulkImportAssignmentsSuccess({assignments: assignments}))
    )
  );

  private deleteAssignment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteAssignment),
      map((action) => this.database.delete(HASHED_ASSIGNMENT_TABLE_NAME, action.assignment)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((assignment: Assignment) => DeleteAssignmentSuccess({assignment: assignment}))
    )
  );

  private deleteAssignmentsByTerritory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteAssignmentsByTerritory),
      concatMap(action => of(action).pipe(
        withLatestFrom(this.store.pipe(select(selectAssignmentsByTerritoryId, action.territoryId)))
      )),
      map(([action, assignments]: [any, any]) => this.database.bulkDelete(HASHED_ASSIGNMENT_TABLE_NAME, assignments)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((assignments: Assignment[]) => DeleteAssignmentsByTerritorySuccess({assignments: assignments}))
    )
  );

  /* Others */

  public test = createEffect(() => this.actions$.pipe(
    ofType(UpsertAssignmentSuccess),
    concatMap((action) => of(action).pipe(
      withLatestFrom(this.store.pipe(select(selectTerritoryById, action.assignment.territoryId)))
    )),
    map(([action, territory]) =>
    {
      const lastDoingAction = action.assignment.endTime ? LastDoingActionsEnum.ASSIGN_RETURN : LastDoingActionsEnum.ASSIGN;
      this.lastDoingsService.createLastDoing(lastDoingAction, `${territory.key} ${territory.name}`);
      this.territoryMapsService.focusOnDrawingIds(null);
      this.territoryMapsService.focusOnDrawingIds(null);

      return UpdateStatusOfDrawings();
    })
  ))

  constructor(private actions$: Actions,
              private store: Store<ApplicationState>,
              private lastDoingsService: LastDoingsService,
              private territoryMapsService: TerritoryMapsService,
              private database: DatabaseService)
  {
  }
}
