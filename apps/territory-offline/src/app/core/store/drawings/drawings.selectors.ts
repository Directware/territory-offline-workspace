import { ApplicationState } from '../index.reducers';
import { createSelector } from '@ngrx/store';
import { drawingsAdapter } from './drawings.reducer';
import { selectLastAssignmentOfEachTerritory } from '../assignments/assignments.selectors';
import {
  selectAllTerritories,
  selectAllTerritoryEntities,
} from '../territories/territories.selectors';
import { selectSettings } from '../settings/settings.selectors';
import { selectCurrentCongregation } from '../congregation/congregations.selectors';
import {
  createDurationPhrase,
  evaluateDrawingProperties,
  evaluateTerritoryStatus,
  mergeDrawings,
} from '@territory-offline-workspace/shared-utils';
import { Drawing } from '@territory-offline-workspace/shared-interfaces';

export const selectDrawingsFeature = (state: ApplicationState) => state.drawings;

export const { selectIds, selectEntities, selectAll, selectTotal } =
  drawingsAdapter.getSelectors(selectDrawingsFeature);

export const selectAllDrawingEntities = createSelector(selectEntities, (entities) => entities);

export const selectAllDrawings = createSelector(
  selectAll,
  selectLastAssignmentOfEachTerritory,
  selectAllTerritories,
  selectSettings,
  (drawings, lastAssignmentOfEachTerritory, territories, settings): Drawing[] => {
    if (drawings) {
      return drawings
        .filter((d) => {
          const isNotNull = !!d;
          const hasFeatureCollection = !!d?.featureCollection;
          const hasFeatures =
            !!d?.featureCollection?.features && d?.featureCollection?.features.length > 0;
          const hasReferenceToTerritory = !!territories.filter(
            (t) => t.territoryDrawingId === d?.id
          )[0];

          return isNotNull && hasFeatureCollection && hasFeatures && hasReferenceToTerritory;
        })
        .map((drawing) => ({
          ...drawing,
          featureCollection: {
            ...drawing.featureCollection,
            features: drawing.featureCollection.features.map((f) => ({
              ...f,
              properties: evaluateDrawingProperties(
                f.properties,
                drawing,
                territories,
                lastAssignmentOfEachTerritory,
                settings
              ),
            })),
          },
        }));
    }

    return [];
  }
);

export const selectDrawingById = createSelector(
  selectDrawingsFeature,
  (state, id) => state.entities[id]
);

export const wholeTerritory = createSelector(
  selectAll,
  selectCurrentCongregation,
  (drawings, congregation) => ({
    mergedDrawings: mergeDrawings(drawings),
    congregation: congregation.name,
  })
);
