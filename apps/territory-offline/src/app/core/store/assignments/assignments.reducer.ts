import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
  BulkImportAssignmentsSuccess,
  BulkUpsertAssignmentsSuccess,
  DeleteAssignmentsByTerritorySuccess,
  DeleteAssignmentSuccess,
  LoadAssignmentsSuccess,
  UpsertAssignmentSuccess,
} from './assignments.actions';
import { Assignment } from '@territory-offline-workspace/shared-interfaces';

export const assignmentsAdapter = createEntityAdapter<Assignment>();

export interface AssignmentsState extends EntityState<Assignment> {}

const initialState: AssignmentsState = assignmentsAdapter.getInitialState();

const assignmentsReducer = createReducer(
  initialState,
  on(LoadAssignmentsSuccess, (state, action) =>
    assignmentsAdapter.addMany(action.assignments, state)
  ),
  on(UpsertAssignmentSuccess, (state, action) =>
    assignmentsAdapter.upsertOne(action.assignment, state)
  ),
  on(BulkUpsertAssignmentsSuccess, (state, action) =>
    assignmentsAdapter.upsertMany(action.assignments, state)
  ),
  on(BulkImportAssignmentsSuccess, (state, action) =>
    assignmentsAdapter.upsertMany(action.assignments, state)
  ),
  on(DeleteAssignmentSuccess, (state, action) =>
    assignmentsAdapter.removeOne(action.assignment.id, state)
  ),
  on(DeleteAssignmentsByTerritorySuccess, (state, action) =>
    assignmentsAdapter.removeMany(
      action.assignments.map((a) => a.id),
      state
    )
  )
);

export function assignmentsReducerFunction(state: AssignmentsState | undefined, action: Action) {
  return assignmentsReducer(state, action);
}
