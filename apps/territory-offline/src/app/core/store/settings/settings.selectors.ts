import { createSelector } from '@ngrx/store';
import { ApplicationState } from '../index.reducers';

export const selectSettingsFeature = (state: ApplicationState) => state.settings;

export const selectSettings = createSelector(selectSettingsFeature, (settings) => settings);

export const selectInitialConfigurationDone = createSelector(
  selectSettingsFeature,
  (settings) => !!settings && settings.initialConfigurationDone
);

export const selectIsAppLocked = createSelector(
  selectSettingsFeature,
  (settings) => settings.isAppLocked
);

export const selectPasswordHash = createSelector(
  selectSettingsFeature,
  (settings) => settings.passwordHash
);

export const selectCurrentCongregationId = createSelector(
  selectSettings,
  (settings) => settings.currentCongregationId
);
