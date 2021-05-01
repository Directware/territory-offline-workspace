import {Action, createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {DeleteLastDoingSuccess, LoadLastDoingsSuccess, UpsertLastDoingSuccess} from './last-doings.actions';
import {LastDoing} from "@territory-offline-workspace/shared-interfaces";

export const lastDoingsAdapter = createEntityAdapter<LastDoing>();

export interface LastDoingsState extends EntityState<LastDoing>
{
}

const initialState: LastDoingsState = lastDoingsAdapter.getInitialState();

const lastDoingsReducer = createReducer(
  initialState,
  on(LoadLastDoingsSuccess, (state, action) => lastDoingsAdapter.addAll(action.lastDoings, state)),
  on(UpsertLastDoingSuccess, (state, action) => lastDoingsAdapter.upsertOne(action.lastDoing, state)),
  on(DeleteLastDoingSuccess, (state, action) => lastDoingsAdapter.removeOne(action.lastDoing.id, state))
);

export function lastDoingsReducerFunction(state: LastDoingsState | undefined, action: Action)
{
  return lastDoingsReducer(state, action);
}
