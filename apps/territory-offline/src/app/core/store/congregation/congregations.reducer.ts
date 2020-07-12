import {Action, createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {Congregation} from './model/congregation.model';
import {
  BulkImportCongregationsSuccess,
  DeleteCongregationSuccess,
  LoadCongregationsSuccess,
  UpsertCongregationSuccess, UseCongregation
} from './congregations.actions';

export const congregationsAdapter = createEntityAdapter<Congregation>();

export interface CongregationsState extends EntityState<Congregation>
{
  currentCongregation: Congregation;
}

const initialState: CongregationsState = congregationsAdapter.getInitialState({
  currentCongregation: null
});

const congregationsReducer = createReducer(
  initialState,
  on(LoadCongregationsSuccess, (state, action) => congregationsAdapter.addAll(action.congregations, state)),
  on(UpsertCongregationSuccess, (state, action) => congregationsAdapter.upsertOne(action.congregation, state)),
  on(BulkImportCongregationsSuccess, (state, action) => congregationsAdapter.upsertMany(action.congregations, state)),
  on(DeleteCongregationSuccess, (state, action) => congregationsAdapter.removeOne(action.congregationId, state)),
  on(UseCongregation, (state, action) => ({...state, currentCongregation: state.entities[action.congregationId]})),
);

export function congregationsReducerFunction(state: CongregationsState | undefined, action: Action)
{
  return congregationsReducer(state, action);
}
