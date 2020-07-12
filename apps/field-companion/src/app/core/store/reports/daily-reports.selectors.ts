import {ApplicationState} from '../index.reducers';
import {dailyReportsAdapter} from "./daily-reports.reducer";
import {createSelector} from "@ngrx/store";
import {emptyDailyReport} from "./model/daily-report.model";
import {emptyMergedDailyReport} from "./model/merged-daily-report.model";
import {selectSettingsFeature} from "../settings/settings.selectors";

export const selectDailyReportsFeature = (state: ApplicationState) => state.dailyReports;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = dailyReportsAdapter.getSelectors(selectDailyReportsFeature);

export const selectAllDailyReports = createSelector(
  selectAll,
  (reports) => reports
);

export const selectNextMonthsDailyReport = createSelector(
  selectAll,
  selectDailyReportsFeature,
  (dailyReports, state) => {

    return dailyReports.filter((dr) =>
      dr.creationTime.getFullYear() === state.chosenTime.year
      && dr.creationTime.getMonth() === state.chosenTime.month + 1
      && dr.creationTime.getDate() === 1
    )[0] || emptyDailyReport(state.chosenTime.year, state.chosenTime.month + 1, 1);
  }
);

export const selectCurrentDailyReports = createSelector(
  selectAll,
  selectDailyReportsFeature,
  (reports, state) =>
  {
    return reports.filter(dr => dr.creationTime.getMonth() === state.chosenTime.month && dr.creationTime.getFullYear() === state.chosenTime.year);
  }
);

export const selectCurrentDailyReportTime = createSelector(
  selectDailyReportsFeature,
  selectCurrentDailyReports,
  (dailyReportsState, dailyReports) =>
  {
    const tmp = [];
    dailyReports.forEach(dr =>
    {
      if (dr.duration > 0 || dr.deliveries > 0 || dr.returnVisits > 0 || dr.videos > 0)
      {
        tmp.push(dr.creationTime)
      }
    });
    return {
      ...dailyReportsState.chosenTime,
      dataExistOnDates: tmp
    };
  }
);

export const selectChosenCalendarCell = createSelector(
  selectDailyReportsFeature,
  (dailyReportsState) => dailyReportsState.chosenCalendarCell
);

export const selectCurrentDailyReport = createSelector(
  selectAll,
  selectDailyReportsFeature,
  (dailyReports, state) =>
  {
    if (!state.chosenCalendarCell)
    {
      return null;
    }

    return dailyReports.filter((dr) =>
      dr.creationTime.getFullYear() === state.chosenTime.year
      && dr.creationTime.getMonth() === state.chosenTime.month
      && dr.creationTime.getDate() === state.chosenCalendarCell.dayIndex
    )[0] || emptyDailyReport(state.chosenTime.year, state.chosenTime.month, state.chosenCalendarCell.dayIndex);
  });

export const selectCurrentLastDayInMonthDailyReport = createSelector(
  selectAll,
  selectDailyReportsFeature,
  (dailyReports, state) =>
  {
    const lastDayInMonth = new Date(state.chosenTime.year, state.chosenTime.month + 1, 0);
    const lastMonthlyDailyReport = dailyReports.filter((dr) =>
      dr.creationTime.getFullYear() === lastDayInMonth.getFullYear()
      && dr.creationTime.getMonth() === lastDayInMonth.getMonth()
      && dr.creationTime.getDate() === lastDayInMonth.getDate()
    )[0];

    return lastMonthlyDailyReport || emptyDailyReport(state.chosenTime.year, state.chosenTime.month + 1, 0);
  }
);

export const selectMergedCurrentDailyReports = createSelector(
  selectCurrentDailyReports,
  (reports) =>
  {
    const mergedEmptyDailyReport = emptyMergedDailyReport();
    if (!reports || reports.length === 0)
    {
      return mergedEmptyDailyReport;
    }

    const tmp = reports.reduce((all, item) => all = {
      videos: all.videos + item.videos,
      returnVisits: all.returnVisits + item.returnVisits,
      duration: all.duration + item.duration,
      deliveries: all.deliveries + item.deliveries,
      studies: all.studies + item.studies,
      creationTime: null,
      id: null,
      prefix: all.prefix
    });

    return {
      ...mergedEmptyDailyReport,
      videos: tmp.videos,
      returnVisits: tmp.returnVisits,
      duration: tmp.duration,
      deliveries: tmp.deliveries,
      studies: tmp.studies
    }
  });

export const selectCurrentDailyReportStudies = createSelector(
  selectMergedCurrentDailyReports,
  (mergedReports) => ({value: mergedReports.studies})
);

export const selectDailyReportForStudy = createSelector(
  selectCurrentDailyReports,
  selectDailyReportsFeature,
  (allCurrentDailyReports, state) =>
  {
    const firstReportInTheMonth = allCurrentDailyReports.filter(dr => dr.creationTime.getDate() === 1)[0];

    if (!firstReportInTheMonth)
    {
      return emptyDailyReport(state.chosenTime.year, state.chosenTime.month, 1);
    }

    return firstReportInTheMonth;
  }
);

export const durationProgress = createSelector(
  selectSettingsFeature,
  selectDailyReportsFeature,
  selectAll,
  (settings, drState, dailyReports) =>
  {
    const monthlyDailyReports = dailyReports.filter((dr) =>
      dr.creationTime.getFullYear() === drState.chosenTime.year
      && dr.creationTime.getMonth() === drState.chosenTime.month
    );

    const monthlySum = monthlyDailyReports.map(dr => dr.duration).reduce((all, item) => all = all + item, 0);

    /* Vom September des Vorjahres bis August des aktuellen Jahres */
    const yearlyDailyReports = dailyReports.filter((dr) =>
      (dr.creationTime.getFullYear() - 1 === drState.chosenTime.year && dr.creationTime.getMonth() > 7)
      || (dr.creationTime.getFullYear() === drState.chosenTime.year && dr.creationTime.getMonth() < 8)
    );

    const yearlySum = yearlyDailyReports.map(dr => dr.duration).reduce((all, item) => all = all + item, 0);

    const monthlyHours = (monthlySum / 60);
    const yearlyHours = (yearlySum / 60);
    return {
      monthly: (monthlyHours / settings.monthlyGoal) * 100,
      monthlyPhrase: monthlyHours + "h",
      monthlyHours: Math.floor(monthlyHours),
      monthlyMinutes: (monthlySum - (Math.floor(monthlyHours) * 60)),
      yearly: (yearlyHours / settings.yearlyGoal) * 100,
      yearlyPhrase: yearlyHours + "h",
      yearlyHours: Math.floor(yearlyHours),
      yearlyMinutes: (yearlySum - (Math.floor(yearlyHours) * 60)),
    };
  }
);
