import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { DailyReport } from '@territory-offline-workspace/shared-interfaces';
import {
  BulkImportDailyReportsSuccess,
  ChangeChosenTime,
  ChooseCalendarCell,
  DeleteDailyReportSuccess,
  LoadDailyReportsSuccess,
  UpsertDailyReportSuccess,
} from './daily-reports.actions';
import { CalendarDatasource } from '../../../views/shared/calendar/model/calendar-datasource.model';
import { CalendarCell } from '../../../views/shared/calendar/model/calendar-cell.model';

export const dailyReportsAdapter = createEntityAdapter<DailyReport>();

export interface DailyReportsState extends EntityState<DailyReport> {
  chosenCalendarCell: CalendarCell;
  chosenTime: CalendarDatasource;
}

const initialState: DailyReportsState = dailyReportsAdapter.getInitialState({
  chosenCalendarCell: null,
  chosenTime: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    dataExistOnDates: [],
  },
});

const dailyReportsReducer = createReducer(
  initialState,
  on(ChooseCalendarCell, (state, action) => ({ ...state, chosenCalendarCell: action.cell })),
  on(LoadDailyReportsSuccess, (state, action) =>
    dailyReportsAdapter.addAll(action.dailyReports, state)
  ),
  on(UpsertDailyReportSuccess, (state, action) =>
    dailyReportsAdapter.upsertOne(action.dailyReport, state)
  ),
  on(BulkImportDailyReportsSuccess, (state, action) =>
    dailyReportsAdapter.upsertMany(action.dailyReports, state)
  ),
  on(DeleteDailyReportSuccess, (state, action) =>
    dailyReportsAdapter.removeOne(action.dailyReport.id, state)
  ),
  on(ChangeChosenTime, (state, action) => ({
    ...state,
    chosenCalendarCell: null,
    chosenTime: action.chosenTime,
  }))
);

export function dailyReportsReducerFunction(state: DailyReportsState | undefined, action: Action) {
  return dailyReportsReducer(state, action);
}
