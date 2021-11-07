import { Action, createReducer, on } from '@ngrx/store';
import { LoadSettingsSuccess, LockApp, UnlockApp, UpsertSettingsSuccess } from './settings.actions';
import { ToLanguage } from '@territory-offline-workspace/ui-components';

export interface SettingsState {
  id: string;
  initialConfigurationDone: boolean;
  currentCongregationId: string;
  territoryOrigin: { lat: number; lng: number };
  passwordHash: string;
  encryptedSecretKey: string | null;
  publicKey: Uint8Array | null;
  isAppLocked: boolean;
  processingPeriodInMonths: number; // Bearbeitung Fällig nach
  processingBreakInMonths: number; // Kann zugeteilt werden nach
  overdueBreakInMonths: number; // Zuteilung überfällig nach
  autoAppLockingInMinutes: number;
  appLanguage: ToLanguage;
}

const initialState = {
  id: '',
  initialConfigurationDone: false,
  currentCongregationId: '',
  territoryOrigin: { lat: 10.8606, lng: 48.35534 },
  passwordHash: '',
  encryptedSecretKey: null,
  publicKey: null,
  isAppLocked: false,
  processingPeriodInMonths: 4,
  processingBreakInMonths: 4,
  overdueBreakInMonths: 4,
  autoAppLockingInMinutes: 0,
  appLanguage: null,
};

const settingsReducer = createReducer(
  initialState,
  on(LockApp, (state) => ({
    ...state,
    isAppLocked: true,
  })),
  on(UnlockApp, (state) => ({
    ...state,
    isAppLocked: false,
  })),
  on(UpsertSettingsSuccess, (state, action) => ({
    ...action.settings,
    publicKey:
      action.settings && action.settings.publicKey
        ? new Uint8Array(Object.values(action.settings.publicKey))
        : null,
  })),
  on(LoadSettingsSuccess, (state, action) => ({
    ...action.settings,
    publicKey:
      action.settings && action.settings.publicKey
        ? new Uint8Array(Object.values(action.settings.publicKey))
        : null,
  }))
);

export function settingsReducerFunction(state: SettingsState | undefined, action: Action) {
  return settingsReducer(state, action);
}
