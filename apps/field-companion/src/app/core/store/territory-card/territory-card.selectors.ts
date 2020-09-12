import {ApplicationState} from '../index.reducers';
import {createSelector} from "@ngrx/store";
import {territoryCardsAdapter} from "./territory-card.reducer";

export const selectTerritoryCardsFeature = (state: ApplicationState) => state.territoryCards;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = territoryCardsAdapter.getSelectors(selectTerritoryCardsFeature);

export const selectAllTerritoryCards = createSelector(
  selectAll,
  (reports) => reports
);
