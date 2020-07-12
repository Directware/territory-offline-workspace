import {TimedEntity} from '../../../model/db/timed-entity.interface';

export interface Assignment extends TimedEntity
{
  publisherId: string;
  territoryId: string;
  startTime: Date;
  endTime?: Date;
  statusColor?: string;
  removedPublisherLabel?: string;
}
