import {Action, createReducer} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {TerritoryCard} from "@territory-offline-workspace/api";

export const territoryCardsAdapter = createEntityAdapter<TerritoryCard>();

export interface TerritoryCardsState extends EntityState<TerritoryCard>
{
}

const initialState: TerritoryCardsState = territoryCardsAdapter.getInitialState({});

const territoryCardReducer = createReducer(
  initialState,
);

export function territoryCardsReducerFunction(state: TerritoryCardsState | undefined, action: Action)
{
  return territoryCardReducer(state, action);
}
