/* eslint-disable */
import * as moment from "moment";
import {
  Assignment,
  Drawing,
  Territory,
  TerritoryStatus,
} from "@territory-offline-workspace/shared-interfaces";

export function logger(message: string, ...args: any) {
  console.log(`%c[TO Logger]: ${message}`, "color: #4f9cdc");
}

/* This function returns a date that lies as many months in the past as the value of the parameter is.*/
export function pastDateByMonths(monthsCount: number) {
  return new Date(new Date().getTime() - monthsCount * 2.628e9);
}

export function createDurationPhrase(startDate: Date) {
  if (typeof startDate !== "string" && startDate && startDate.getTime() > 0) {
    const startMoment = moment(startDate);
    const nowMoment = moment(new Date());
    const durationInDays = nowMoment.diff(startMoment, "days", true);

    const averageDaysInMonth = 30.416;
    const averageDaysInYear = 365.2425;
    let durationPhrase = "";

    let remainingDuration = durationInDays;
    const years: number = Math.floor(durationInDays / averageDaysInYear);

    if (years > 0) {
      remainingDuration = durationInDays - years * averageDaysInYear;
      durationPhrase = durationPhrase.concat(`${years}J `);
    }

    const months: number = Math.floor(remainingDuration / averageDaysInMonth);
    remainingDuration =
      months > 0
        ? remainingDuration - months * averageDaysInMonth
        : remainingDuration;
    durationPhrase = durationPhrase.concat(
      `${months.toString(10).padStart(2, "0")}M `
    );

    const days: number = Math.floor(remainingDuration);
    durationPhrase = durationPhrase.concat(
      `${days.toString(10).padStart(2, "0")}T`
    );

    return durationPhrase;
  }
  return "-";
}

export function evaluateDrawingProperties(
  props,
  drawing: Drawing,
  territories: Territory[],
  lastAssignments: Assignment[],
  settings
): { [name: string]: any } | any {
  const territory = territories.filter(
    (t) => t.territoryDrawingId === drawing.id
  )[0];
  const assignment = lastAssignments.filter(
    (a) => a.territoryId === territory.id
  )[0];
  const isAssigned = assignment && !assignment.endTime;

  if (territory) {
    return {
      ...props,
      ...evaluateTerritoryStatus(assignment, settings),
      isAssigned,
      description: territory.key,
      durationPhrase: `${territory.key} (${
        assignment
          ? createDurationPhrase(
              isAssigned ? assignment.startTime : assignment.endTime
            )
          : "-"
      })`,
    };
  }

  return { ...props };
}

export function evaluateTerritoryStatus(assignment: Assignment, settings: any) {
  if (!assignment) {
    return {
      color: TerritoryStatus.NEVER_ASSIGNED,
      status: TerritoryStatus.NEVER_ASSIGNED,
    };
  }

  if (!assignment.endTime) {
    return {
      color: TerritoryStatus.IN_PROGRESS,
      status: TerritoryStatus.IN_PROGRESS,
    };
  }

  if (assignment.endTime > pastDateByMonths(settings.processingBreakInMonths)) {
    return {
      color: TerritoryStatus.DONE,
      status: TerritoryStatus.DONE,
    };
  }

  if (
    assignment.endTime < pastDateByMonths(settings.processingBreakInMonths) &&
    assignment.endTime > pastDateByMonths(settings.overdueBreakInMonths)
  ) {
    return {
      color: TerritoryStatus.READY_FOR_ASSIGN,
      status: TerritoryStatus.READY_FOR_ASSIGN,
    };
  }

  if (assignment.startTime < pastDateByMonths(settings.overdueBreakInMonths)) {
    return {
      color: TerritoryStatus.DUE,
      status: TerritoryStatus.DUE,
    };
  }
}

/*
 * Only merges Polygons!
 */
export function mergeDrawings(drawings: Drawing[]): Drawing {
  if (drawings && drawings.length > 0) {
    const onlyDrawingPolygons = drawings.filter(
      (drawing) =>
        drawing.featureCollection &&
        drawing.featureCollection.features &&
        drawing.featureCollection.features.filter(
          (f) => f.geometry && f.geometry.type === "Polygon"
        ).length > 0
    );

    const drawingsWithAssignedProperties = onlyDrawingPolygons.map(
      (drawing) => ({
        ...drawing,
        featureCollection: {
          ...drawing.featureCollection,
          features: drawing.featureCollection.features.map((feature) => ({
            ...feature,
            properties: { ...feature.properties, drawingId: drawing.id },
          })),
        },
      })
    );

    if (drawingsWithAssignedProperties.length > 0) {
      return drawingsWithAssignedProperties.reduce((result, current) => ({
        ...result,
        featureCollection: {
          ...result.featureCollection,
          features: [
            ...result.featureCollection.features,
            ...current.featureCollection.features,
          ],
        },
      }));
    }
  }

  return null;
}

export function isInLocationPath(pathName: string): boolean {
  /* startsWith is an der Stelle eine schlechte Wahl, weil in Electron der Dateipfad davor kommt */
  return window.location.pathname.includes(pathName);
}

export function currentServiceYear(): string {
  return serviceYearByDate(new Date());
}

export function serviceYearByDate(date: Date) {
  const september = 8;
  const startingPoint = date;

  if (startingPoint.getMonth() >= september) {
    return `${startingPoint.getFullYear()}/${startingPoint.getFullYear() + 1}`;
  }

  return `${startingPoint.getFullYear() - 1} / ${startingPoint.getFullYear()}`;
}

export function includedInThisServiceYear(a: Assignment): boolean {
  const isAssignmentCompleted = !!a.startTime && !!a.endTime && a.endTime;

  if (!isAssignmentCompleted) {
    return false;
  }

  const { serviceYearStart, serviceYearEnd } = getServiceYearTimes(new Date());

  const startTime = serviceYearStart.getTime();
  const endTime = serviceYearEnd.getTime();
  const assignmentTime = a.endTime.getTime();

  return startTime < assignmentTime && endTime > assignmentTime;
}

export function startedInServiceYear(
  serviceYear: Date,
  a: Assignment
): boolean {
  if (!a) {
    return false;
  }

  const { serviceYearStart, serviceYearEnd } = getServiceYearTimes(serviceYear);
  const startTime = serviceYearStart.getTime();
  const endTime = serviceYearEnd.getTime();

  const assignmentTime = a.startTime.getTime();

  return startTime < assignmentTime && endTime > assignmentTime;
}

export function endedInServiceYear(serviceYear: Date, a: Assignment): boolean {
  if (!a || !a.endTime) {
    return false;
  }

  const { serviceYearStart, serviceYearEnd } = getServiceYearTimes(serviceYear);
  const startTime = serviceYearStart.getTime();
  const endTime = serviceYearEnd.getTime();

  const assignmentTime = a.endTime.getTime();

  return startTime < assignmentTime && endTime > assignmentTime;
}

export function getServiceYearTimes(startTimePoint: Date) {
  const september = 8;
  let serviceYearStart;
  let serviceYearEnd;

  if (startTimePoint.getMonth() >= september) {
    // Angefangen: dieses Jahr am 1. September
    // prettier-ignore
    serviceYearStart = new Date(startTimePoint.getFullYear(),september,1,0,0,0);

    // Endet: nächstes Jahr am 31. August um Mitternacht
    // prettier-ignore
    serviceYearEnd = new Date(startTimePoint.getFullYear() + 1,september,0,23,59,59);
  } else {
    // Angefangen: letzes Jahr am 1. September
    // prettier-ignore
    serviceYearStart = new Date(startTimePoint.getFullYear() - 1,september,1,0,0,0);

    // Endet: dieses Jahr am 31. August um Mitternacht
    // prettier-ignore
    serviceYearEnd = new Date(startTimePoint.getFullYear(),september,0,23,59,59);
  }
  return { serviceYearStart, serviceYearEnd };
}

export function normalizeStreetName(street: string): string {
  if (!street) {
    return "";
  }

  if (typeof street !== "string") {
    street = `${street}`;
  }

  return street.trim();
}

export function normalizeStreetSuffix(streetSuffix: string): string {
  if (!streetSuffix) {
    return "";
  }

  if (typeof streetSuffix !== "string") {
    streetSuffix = `${streetSuffix}`;
  }

  if (streetSuffix.includes("/")) {
    const slashPosition = streetSuffix.trim().indexOf("/");
    if (streetSuffix.charAt(slashPosition - 2) !== " ") {
      streetSuffix = [
        streetSuffix.slice(0, slashPosition - 1),
        " ",
        streetSuffix.slice(slashPosition - 1),
      ].join("");
    }
  }

  return streetSuffix.replace(new RegExp(/[a-zA-Z]\w+/g), "").trim();
}

export function serializeObject(object): string {
  if (!object) {
    return "";
  }
  let stringifiedObject = "null";

  try {
    stringifiedObject = JSON.stringify(object);
  } catch (e) {
    console.error("[serializeObject()]:", JSON.stringify(e));
  }

  return stringifiedObject;
}

export function deserializeObject(objectAsString: string): any {
  if (
    !objectAsString ||
    objectAsString === "null" ||
    objectAsString === "NULL"
  ) {
    // NULL is ios specific!
    return {};
  }

  return JSON.parse(objectAsString);
}

export function serializeArray(data: any[]): string {
  if (!data || data.length === 0) {
    return "null";
  }

  return JSON.stringify(data);
}

export function deserializeArray(arrayAsString: string): any[] {
  if (!arrayAsString || arrayAsString === "null" || arrayAsString === "NULL") {
    // NULL is ios specific!
    return [];
  }

  return JSON.parse(arrayAsString);
}

export function serializeDate(date: Date): string {
  if (!date) {
    return "null";
  }

  return date.toISOString();
}

export function deserializeDate(isoDateString: string): Date {
  if (!isoDateString || isoDateString === "null" || isoDateString === "NULL") {
    // NULL is ios specific!
    return null;
  }

  return new Date(isoDateString);
}

export function serializeBoolean(value: boolean | string): string {
  if (value === true || value === "true") {
    return "true";
  }

  return "false";
}
