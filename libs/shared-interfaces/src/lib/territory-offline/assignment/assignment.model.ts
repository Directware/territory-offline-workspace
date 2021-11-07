import { TimedEntity } from './../../common/timed-entity.model';

export interface Assignment extends TimedEntity {
  publisherId: string;
  territoryId: string;
  startTime: Date;
  endTime?: Date;
  statusColor?: string;
  removedPublisherLabel?: string;
}
