import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
  BulkImportDrawingsSuccess,
  DeleteDrawingSuccess,
  LoadDrawingsSuccess,
  UpsertDrawingSuccess,
} from './drawings.actions';
import { Drawing } from '@territory-offline-workspace/shared-interfaces';

export const drawingsAdapter = createEntityAdapter<Drawing>();

export interface DrawingsState extends EntityState<Drawing> {}

const initialState: DrawingsState = drawingsAdapter.getInitialState();

const drawingsReducer = createReducer(
  initialState,
  on(LoadDrawingsSuccess, (state, action) => drawingsAdapter.addMany(action.drawings, state)),
  on(UpsertDrawingSuccess, (state, action) => drawingsAdapter.upsertOne(action.drawing, state)),
  on(BulkImportDrawingsSuccess, (state, action) =>
    drawingsAdapter.upsertMany(action.drawings, state)
  ),
  on(DeleteDrawingSuccess, (state, action) => drawingsAdapter.removeOne(action.drawing.id, state))
);

export function drawingsReducerFunction(state: DrawingsState | undefined, action: Action) {
  return drawingsReducer(state, action);
}
