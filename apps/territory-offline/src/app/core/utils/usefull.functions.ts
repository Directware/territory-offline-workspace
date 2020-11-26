import {SettingsState} from "../store/settings/settings.reducer";
import {Assignment, Drawing, TerritoryStatus} from "@territory-offline-workspace/api";
import * as moment from "moment";

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
  if (startDate && startDate.getTime() > 0)
  {
    const startMoment = moment(startDate);
    const nowMoment = moment(new Date());
    const durationInDays = nowMoment.diff(startMoment, "days", true);

    const averageDaysInMonth = 30.416;
    const averageDaysInYear = 365.2425;
    let durationPhrase = "";

    let remainingDuration = durationInDays;
    let years: number = Math.floor(durationInDays / averageDaysInYear);

    if (years > 0)
    {
      remainingDuration = durationInDays - (years * averageDaysInYear);
      durationPhrase = durationPhrase.concat(`${years}J `);
    }

    let months: number = Math.floor(remainingDuration / averageDaysInMonth);
    remainingDuration = months > 0 ? remainingDuration - (months * averageDaysInMonth) : remainingDuration;
    durationPhrase = durationPhrase.concat(`${months.toString(10).padStart(2, "0")}M `);

    const days: number = Math.floor(remainingDuration);
    durationPhrase = durationPhrase.concat(`${days.toString(10).padStart(2, "0")}T`);

    return durationPhrase;
  }
  return "-";
}

export function evaluateTerritoryStatus(assignment: Assignment, settings: SettingsState)
{
  if (!assignment)
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

export function currentServiceYear(): string
{
  const september = 8;
  const today = new Date();
  if (today.getMonth() >= september)
  {
    return `${today.getFullYear()}/${today.getFullYear() + 1}`;
  }

  return `${today.getFullYear() - 1}/${today.getFullYear()}`;
}
