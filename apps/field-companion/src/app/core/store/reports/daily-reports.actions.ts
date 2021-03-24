import {createAction, props} from '@ngrx/store';
import {DailyReport} from "@territory-offline-workspace/shared-interfaces";
import {CalendarCell} from "../../../views/shared/calendar/model/calendar-cell.model";
import {CalendarDatasource} from "../../../views/shared/calendar/model/calendar-datasource.model";

export const LoadDailyReports = createAction('[DailyReport] load daily reports');
export const LoadDailyReportsSuccess = createAction('[DailyReport] load daily reports success', props<{ dailyReports: DailyReport[] }>());

export const BulkImportDailyReports = createAction('[DailyReport] bulk import daily reports', props<{ dailyReports: DailyReport[] }>());
export const BulkImportDailyReportsSuccess = createAction('[DailyReport] bulk import daily reports success', props<{ dailyReports: DailyReport[] }>());

export const UpsertDailyReport = createAction('[DailyReport] upsert daily report', props<{ dailyReport: DailyReport }>());
export const UpsertDailyReportSuccess = createAction('[DailyReport] upsert daily report success', props<{ dailyReport: DailyReport }>());

export const DeleteDailyReport = createAction('[DailyReport] delete daily report', props<{ dailyReport: DailyReport }>());
export const DeleteDailyReportSuccess = createAction('[DailyReport] delete daily report success', props<{ dailyReport: DailyReport }>());

export const ChooseCalendarCell = createAction("[DailyReport] choose calendar cell", props<{ cell: CalendarCell }>());
export const ChangeChosenTime = createAction("[DailyReport] change chosen time", props<{ chosenTime: CalendarDatasource }>());

export const SetStudies = createAction("[DailyReport] set studies", props<{count: number}>());
export const IncreaseStudies = createAction("[DailyReport] increase studies");
export const DecreaseStudies = createAction("[DailyReport] decrease studies");
