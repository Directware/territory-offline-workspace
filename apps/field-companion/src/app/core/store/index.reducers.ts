import {ActionReducerMap} from "@ngrx/store";
import {settingsReducerFunction, SettingsState} from "./settings/settings.reducer";
import {dailyReportsReducerFunction, DailyReportsState} from "./reports/daily-reports.reducer";
import {territoryCardsReducerFunction, TerritoryCardsState} from "./territory-card/territory-card.reducer";

export interface ApplicationState
{
  settings: SettingsState,
  dailyReports: DailyReportsState,
  territoryCards: TerritoryCardsState,
}

export const reducers: ActionReducerMap<ApplicationState> = {
  settings: settingsReducerFunction,
  dailyReports: dailyReportsReducerFunction,
  territoryCards: territoryCardsReducerFunction,
};
