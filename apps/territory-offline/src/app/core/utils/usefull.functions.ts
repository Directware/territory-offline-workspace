import {SettingsState} from "../store/settings/settings.reducer";
import {Assignment, Drawing, TerritoryStatus} from "@territory-offline-workspace/api";

export function logger(message: string, ...args: any)
{
  console.log(`%c[TO Logger]: ${message}`, 'color: #4f9cdc');
}

/* This function returns a date that lies as many months in the past as the value of the parameter is.*/
export function pastDateByMonths(monthsCount: number)
{
  return new Date(new Date().getTime() - (monthsCount * 2.628e+9));
}

export function createDurationPhrase(startDate: Date)
{
  if (startDate)
  {
    const today = new Date();
    const countOfMonthsInYear = 30.416;

    const diffTime = Math.abs(startDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / countOfMonthsInYear);
    const days = Math.floor(diffDays - (months * countOfMonthsInYear));

    return `${months}M ${days.toString().padStart(2, '0')}T`;
  }
  return "-";
}

export function evaluateTerritoryStatus(assignment: Assignment, settings: SettingsState)
{
  if(!assignment)
  {
    return {
      color: TerritoryStatus.NEVER_ASSIGNED,
      status: TerritoryStatus.NEVER_ASSIGNED
    };
  }

  if (!assignment.endTime)
  {
    return {
      color: TerritoryStatus.IN_PROGRESS,
      status: TerritoryStatus.IN_PROGRESS
    };
  }

  if (assignment.endTime > pastDateByMonths(settings.processingBreakInMonths))
  {
    return {
      color: TerritoryStatus.DONE,
      status: TerritoryStatus.DONE
    };
  }

  if (assignment.endTime < pastDateByMonths(settings.processingBreakInMonths)
    && assignment.endTime > pastDateByMonths(settings.overdueBreakInMonths))
  {
    return {
      color: TerritoryStatus.READY_FOR_ASSIGN,
      status: TerritoryStatus.READY_FOR_ASSIGN
    };
  }

  if (assignment.startTime < pastDateByMonths(settings.overdueBreakInMonths))
  {
    return {
      color: TerritoryStatus.DUE,
      status: TerritoryStatus.DUE
    };
  }
}

export function mergeDrawings(drawings: Drawing[]): Drawing
{
  if (drawings && drawings.length > 0)
  {
    const drawingsWithFeatures = drawings.filter((drawing) => drawing.featureCollection && drawing.featureCollection.features);

    drawingsWithFeatures.forEach((drawing) => drawing.featureCollection.features.forEach(feature => feature.properties['drawingId'] = drawing.id));

    return drawingsWithFeatures.reduce((result, current) => ({
      ...result,
      featureCollection: {
        ...result.featureCollection,
        features: [
          ...result.featureCollection.features,
          ...current.featureCollection.features
        ]
      }
    }));
  }

  return null;
}

export function parseXlsxDate(data: { t: string, v: number }): Date
{
  if (data.t === "n")
  {

  }

  return new Date();
}

export function isInLocationPath(pathName: string): boolean
{
  /* startsWith is an der Stelle eine schlechte Wahl, weil in Electron der Dateipfad davor kommt */
  return window.location.pathname.includes(pathName);
}
