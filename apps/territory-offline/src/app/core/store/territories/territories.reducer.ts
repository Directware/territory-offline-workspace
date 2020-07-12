import {Action, createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {Territory} from './model/territory.model';
import {
  BulkImportTerritoriesSuccess,
  BulkUpsertTerritorySuccess,
  DeleteTerritorySuccess,
  LoadTerritoriesSuccess,
  UpsertTerritorySuccess
} from './territories.actions';

export const territoriesAdapter = createEntityAdapter<Territory>();

export interface TerritoriesState extends EntityState<Territory>
{
}

const initialState: TerritoriesState = territoriesAdapter.getInitialState();

const territoriesReducer = createReducer(
  initialState,
  on(LoadTerritoriesSuccess, (state, action) => territoriesAdapter.addAll(action.territories, state)),
  on(UpsertTerritorySuccess, (state, action) => territoriesAdapter.upsertOne(action.territory, state)),
  on(BulkUpsertTerritorySuccess, (state, action) => territoriesAdapter.upsertMany(action.territories, state)),
  on(BulkImportTerritoriesSuccess, (state, action) => territoriesAdapter.upsertMany(action.territories, state)),
  on(DeleteTerritorySuccess, (state, action) => territoriesAdapter.removeOne(action.territory.id, state))
);

export function territoriesReducerFunction(state: TerritoriesState | undefined, action: Action)
{
  return territoriesReducer(state, action);
}
