import { ApplicationState } from '../index.reducers';
import { territoriesAdapter } from './territories.reducer';
import { createSelector } from '@ngrx/store';

export const selectTerritoriesFeature = (state: ApplicationState) => state.territories;

export const { selectIds, selectEntities, selectAll, selectTotal } =
  territoriesAdapter.getSelectors(selectTerritoriesFeature);

export const selectAllTerritoryEntities = createSelector(selectEntities, (entities) => entities);

export const selectAllTerritories = createSelector(selectAll, (territories) =>
  territories.sort((t1, t2) => (t1.key > t2.key ? 1 : -1))
);

export const selectTerritoryByDrawingId = createSelector(
  selectAll,
  (territories, drawingId) => territories.filter((t) => t.territoryDrawingId === drawingId)[0]
);

export const selectTerritoriesCount = createSelector(selectTotal, (total) => '' + total);

export const selectWholePopulationCount = createSelector(
  selectAll,
  (territories) =>
    '' +
    (territories && territories.length > 0
      ? territories.map((t) => t.populationCount).reduce((total, current) => total + current)
      : 0)
);

export const selectTerritoryById = createSelector(
  selectTerritoriesFeature,
  (territoryState, id) => territoryState.entities[id]
);
