import { createAction, props } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

export const LoadSettings = createAction('[Settings] load settings');
export const LoadSettingsSuccess = createAction(
  '[Settings] load settings success',
  props<{ settings: SettingsState }>()
);

export const UpsertSettings = createAction(
  '[Settings] upsert settings',
  props<{ settings: SettingsState }>()
);
export const UpsertSettingsSuccess = createAction(
  '[Settings] upsert settings success',
  props<{ settings: SettingsState }>()
);

export const ResetSettings = createAction('[Settings] reset settings');
export const ResetSettingsSuccess = createAction('[Settings] reset settings success');
