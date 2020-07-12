import {ApplicationState} from '../index.reducers';
import {lastDoingsAdapter} from './last-doings.reducer';
import {createSelector} from "@ngrx/store";

export const selectLastDoingsFeature = (state: ApplicationState) => state.lastDoings;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = lastDoingsAdapter.getSelectors(selectLastDoingsFeature);

export const selectLastDoings = createSelector(
  selectAll,
  (lastDoings) => lastDoings.sort((ld1, ld2) => ld1.creationTime.getTime() < ld2.creationTime.getTime() ? 1 : -1)
);

export const selectLastDoingsForTidyUp = createSelector(
  selectAll,
  (lastDoings) => lastDoings.sort((ld1, ld2) => ld1.creationTime.getTime() < ld2.creationTime.getTime() ? 1 : -1)
);
