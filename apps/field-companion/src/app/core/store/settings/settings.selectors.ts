import {createSelector} from '@ngrx/store';
import {ApplicationState} from '../index.reducers';

export const selectSettingsFeature = (state: ApplicationState) => state.settings;

export const selectSettings = createSelector(
  selectSettingsFeature,
  (settings) => settings
);

export const selectInitialConfigurationDone = createSelector(
  selectSettingsFeature,
  (settings) => !!settings && settings.initialConfigurationDone
);

export const selectGoals = createSelector(
  selectSettingsFeature,
  (settings) =>
  {
    return {
      yearly: settings.yearlyGoal || 0,
      monthly: settings.monthlyGoal || 0
    }
  }
);

export const selectUserLanguage = createSelector(
  selectSettingsFeature,
  (settings) => settings && settings.userLanguage ? settings.userLanguage.languageCode : null
);

export const selectDurationStep = createSelector(
  selectSettingsFeature,
  (settings) => settings.durationStep || 30
);
