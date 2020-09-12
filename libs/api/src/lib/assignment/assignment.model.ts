import {TimedEntity} from "@territory-offline-workspace/api";

export interface Assignment extends TimedEntity
{
  publisherId: string;
  territoryId: string;
  startTime: Date;
  endTime?: Date;
  statusColor?: string;
  removedPublisherLabel?: string;
}
