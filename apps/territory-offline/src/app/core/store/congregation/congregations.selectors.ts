import {ApplicationState} from '../index.reducers';
import {createSelector} from '@ngrx/store';
import {congregationsAdapter} from './congregations.reducer';
import {selectCurrentCongregationId} from '../settings/settings.selectors';

export const selectCongregationsFeature = (state: ApplicationState) => state.congregations;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = congregationsAdapter.getSelectors(selectCongregationsFeature);

export const selectAllCongregations = createSelector(
  selectAll,
  (congregations) => congregations
);

export const selectAllCongregationsWithActiveFirst = createSelector(
  selectAll,
  selectEntities,
  selectCurrentCongregationId,
  (congregations, entities, currentId) => [entities[currentId], ...congregations.filter(c => c.id !== currentId)]
);

export const selectCongregationById = createSelector(
  selectCongregationsFeature,
  (congregationState, id) => congregationState.entities[id]
);

export const selectCurrentCongregation = createSelector(
  selectCongregationsFeature,
  (congregationState) => congregationState.currentCongregation
);
