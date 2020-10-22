import {Action, createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {Congregation} from "@territory-offline-workspace/api";
import {
  BulkImportCongregationsSuccess,
  DeleteCongregationSuccess,
  LoadCongregationsSuccess,
  UpsertCongregationSuccess, UseCongregation
} from './congregations.actions';

export const congregationsAdapter = createEntityAdapter<Congregation>();

export interface CongregationsState extends EntityState<Congregation>
{
  currentCongregation: Congregation | null;
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
  on(UseCongregation, (state, action) =>
  {
    const congregation = state.entities[action.congregationId];
    if (congregation)
    {
      return {...state, currentCongregation: congregation};
    }
    return state;
  }),
);

export function congregationsReducerFunction(state: CongregationsState | undefined, action: Action)
{
  return congregationsReducer(state, action);
}
