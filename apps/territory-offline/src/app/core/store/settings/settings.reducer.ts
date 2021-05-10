import {Action, createReducer, on} from '@ngrx/store';
import {
  LoadSettingsSuccess,
  LockApp,
  UnlockApp,
  UnlockSecretKey,
  UpsertSettings,
  UpsertSettingsSuccess
} from './settings.actions';
import {ToLanguage} from "@territory-offline-workspace/ui-components";

export interface SettingsState
{
  id: string;
  initialConfigurationDone: boolean;
  currentCongregationId: string;
  territoryOrigin: { lat: number, lng: number };
  passwordHash: string;
  encryptedSecretKey: string | null;
  publicKey: Uint8Array | null;
  secretKey: Uint8Array | null;
  isAppLocked: boolean;
  processingPeriodInMonths: number; // Bearbeitung Fällig nach
  processingBreakInMonths: number; // Kann zugeteilt werden nach
  overdueBreakInMonths: number; // Zuteilung überfällig nach
  autoAppLockingInMinutes: number;
  releaseInfo: any;
  appLanguage: ToLanguage;
}

const initialState = {
  id: '',
  initialConfigurationDone: false,
  currentCongregationId: '',
  territoryOrigin: {lat: 10.860600, lng: 48.355340},
  passwordHash: '',
  encryptedSecretKey: null,
  publicKey: null,
  secretKey: null,
  isAppLocked: false,
  processingPeriodInMonths: 4,
  processingBreakInMonths: 4,
  overdueBreakInMonths: 4,
  autoAppLockingInMinutes: 0,
  releaseInfo: null,
  appLanguage: null
};

const settingsReducer = createReducer(
  initialState,
  on(LockApp, state => ({
    ...state,
    isAppLocked: true,
    secretKey: null
  })),
  on(UnlockSecretKey, (state: SettingsState, action) => ({
    ...state,
    secretKey: action.secretKey
  })),
  on(UnlockApp, (state) => ({
    ...state,
    isAppLocked: false
  })),
  on(UpsertSettingsSuccess, (state, action) => ({
    ...action.settings,
    publicKey: action.settings && action.settings.publicKey ? new Uint8Array(Object.values(action.settings.publicKey)) : null,
    secretKey: action.settings && action.settings.secretKey ? new Uint8Array(Object.values(action.settings.secretKey)) : null
  })),
  on(LoadSettingsSuccess, (state, action) => ({
    ...action.settings,
    publicKey: action.settings && action.settings.publicKey ? new Uint8Array(Object.values(action.settings.publicKey)) : null,
    secretKey: action.settings && action.settings.secretKey ? new Uint8Array(Object.values(action.settings.secretKey)) : null
  }))
);

export function settingsReducerFunction(state: SettingsState | undefined, action: Action)
{
  return settingsReducer(state, action);
}
