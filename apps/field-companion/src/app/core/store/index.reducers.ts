import {ActionReducerMap} from "@ngrx/store";
import {settingsReducerFunction, SettingsState} from "./settings/settings.reducer";
import {dailyReportsReducerFunction, DailyReportsState} from "./reports/daily-reports.reducer";

export interface ApplicationState
{
  settings: SettingsState,
  dailyReports: DailyReportsState,
}

export const reducers: ActionReducerMap<ApplicationState> = {
  settings: settingsReducerFunction,
  dailyReports: dailyReportsReducerFunction,
};
