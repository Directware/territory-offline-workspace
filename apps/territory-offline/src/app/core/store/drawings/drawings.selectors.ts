import {ApplicationState} from '../index.reducers';
import {createSelector} from '@ngrx/store';
import {drawingsAdapter} from './drawings.reducer';
import {selectLastAssignmentOfEachTerritory} from "../assignments/assignments.selectors";
import {selectAllTerritories} from "../territories/territories.selectors";
import {selectSettings} from "../settings/settings.selectors";
import {createDurationPhrase, evaluateTerritoryStatus, mergeDrawings} from "../../../../../../../libs/api/src/utils/usefull.functions";
import {selectCurrentCongregation} from "../congregation/congregations.selectors";

export const selectDrawingsFeature = (state: ApplicationState) => state.drawings;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = drawingsAdapter.getSelectors(selectDrawingsFeature);

export const selectAllDrawingEntities = createSelector(
  selectEntities,
  (entities) => entities
);

export const selectAllDrawings = createSelector(
  selectAll,
  selectLastAssignmentOfEachTerritory,
  selectAllTerritories,
  selectSettings,
  (drawings, lastAssignmentOfEachTerritory, territories, settings) =>
  {
    territories.forEach((territory) =>
    {
      const _drawings = drawings.filter(d => d.id === territory.territoryDrawingId);
      const _assignment = lastAssignmentOfEachTerritory.filter(a => a.territoryId === territory.id)[0];
      const isAssigned = !!_assignment && !_assignment.endTime;

      _drawings.forEach(d => d.featureCollection.features.forEach(f => f.properties = {
        ...f.properties,
        ...evaluateTerritoryStatus(_assignment, settings),
        isAssigned: isAssigned,
        description: territory.key,
        durationPhrase: `${territory.key} (${_assignment ? createDurationPhrase(isAssigned ? _assignment.startTime : _assignment.endTime) : "-"})`
      }))
    });

    return drawings;
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
    congregation: congregation.name
  })
);
