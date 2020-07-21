import {Action, createReducer, on} from '@ngrx/store';
import {LoadSettingsSuccess, UpsertSettingsSuccess} from './settings.actions';
import {TimedEntity} from "../../services/database/timed-entity.interface";
import {ToLanguage} from "@territory-offline-workspace/ui-components";
import {settingsCollectionName} from "../../services/database/collection-names";
import {Dictionary} from "@ngrx/entity";

export interface SettingsState extends TimedEntity
{
  id: string;
  userId: string;
  userName: string;
  userLanguage: ToLanguage;
  initialConfigurationDone: boolean;
  creationTime: Date;
  yearlyGoal: number;
  monthlyGoal: number;
  monthlyReminder: boolean;
  prefix: string;
  durationStep: number;
  confirmedFeatures: Dictionary<string>;
}

const initialState = {
  id: '',
  userId: null,
  userName: null,
  userLanguage: null,
  initialConfigurationDone: false,
  creationTime: new Date(),
  yearlyGoal: 0,
  monthlyGoal: 0,
  monthlyReminder: false,
  prefix: settingsCollectionName,
  durationStep: 30,
  confirmedFeatures: null
};

const settingsReducer = createReducer(
  initialState,
  on(UpsertSettingsSuccess, (state, action) => ({
    ...action.settings
  })),
  on(LoadSettingsSuccess, (state, action) => ({
    ...action.settings
  }))
);

export function settingsReducerFunction(state: SettingsState | undefined, action: Action)
{
  return settingsReducer(state, action);
}
