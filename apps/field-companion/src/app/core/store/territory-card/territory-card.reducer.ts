import {Action, createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {TerritoryCard} from "@territory-offline-workspace/shared-interfaces";
import {
  DeleteTerritoryCardSuccess,
  LoadTerritoryCardsSuccess,
  UpsertTerritoryCardSuccess
} from "./territory-card.actions";

export const territoryCardsAdapter = createEntityAdapter<TerritoryCard>();

export interface TerritoryCardsState extends EntityState<TerritoryCard>
{
}

const initialState: TerritoryCardsState = territoryCardsAdapter.getInitialState({});

const territoryCardReducer = createReducer(
  initialState,
  on(LoadTerritoryCardsSuccess, (state, action) => territoryCardsAdapter.upsertMany(action.territoryCards, state)),
  on(UpsertTerritoryCardSuccess, (state, action) => territoryCardsAdapter.upsertOne(action.territoryCard, state)),
  on(DeleteTerritoryCardSuccess, (state, action) => territoryCardsAdapter.removeOne(action.territoryCard.id, state)),
);

export function territoryCardsReducerFunction(state: TerritoryCardsState | undefined, action: Action)
{
  return territoryCardReducer(state, action);
}
