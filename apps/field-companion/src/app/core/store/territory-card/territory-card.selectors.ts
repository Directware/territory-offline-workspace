import { ApplicationState } from '../index.reducers';
import { createSelector } from '@ngrx/store';
import { territoryCardsAdapter } from './territory-card.reducer';
import * as moment from 'moment';
import { TerritoryCard } from '@territory-offline-workspace/shared-interfaces';

export const selectTerritoryCardsFeature = (state: ApplicationState) => state.territoryCards;

export const { selectIds, selectEntities, selectAll, selectTotal } =
  territoryCardsAdapter.getSelectors(selectTerritoryCardsFeature);

export const selectAllTerritoryCards = selectAll;

export const selectAllExpiredTerritoryCards = createSelector(selectAll, (territoryCards) =>
  territoryCards.filter((t) => isExpired(t))
);

export const selectAllNotExpiredTerritoryCards = createSelector(selectAll, (territoryCards) =>
  territoryCards.filter((t) => !isExpired(t))
);

export const selectTerritoryCardById = createSelector(
  selectEntities,
  (entities, id) => entities[id]
);

function isExpired(territoryCard: TerritoryCard): boolean {
  const today = moment(new Date());
  const end = moment(territoryCard.assignment.startTime).add(territoryCard.estimationInMonths, 'M');

  return today.isAfter(end);
}
