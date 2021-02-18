import { v4 as uuid4 } from 'uuid';
import {dailyReportCollectionName} from "../../../services/database/collection-names";
import {TimedEntity} from "@territory-offline-workspace/api";

export interface DailyReport extends TimedEntity
{
  videos: number;
  returnVisits: number;
  duration: number;
  deliveries: number;
  studies: number;
}

export function emptyDailyReport(year: number, month: number, day: number): DailyReport
{
  return {
    id: uuid4(),
    creationTime: new Date(year, month, day),
    videos: 0,
    returnVisits: 0,
    duration: 0,
    deliveries: 0,
    studies: 0,
    prefix: dailyReportCollectionName
  };
}

export function convertGrapesReportsToDailyReports(grapesReports: any[]): DailyReport[]
{
  return grapesReports.map((report) => ({
    id: uuid4(),
    creationTime: fixCreationDate(new Date(report.creationTime)),
    videos: report.videos,
    deliveries: report.deliveries,
    returnVisits: report.return_visits,
    studies: report.studies,
    duration: report.duration,
    prefix: dailyReportCollectionName
  }));
}

function fixCreationDate(creationDate: Date)
{
  return new Date(creationDate.getFullYear(), creationDate.getMonth(), creationDate.getDate());
}
