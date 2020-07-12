import {TimedEntity} from '../../../model/db/timed-entity.interface';

export interface VisitBan extends TimedEntity
{
  name: string;
  street: string;
  streetSuffix: string;
  territoryId: string;
  tags: string[];
  city?: string;
  floor?: number;
  lastVisit?: Date;
  comment?: string;
  gpsPosition?: { lat: number, lng: number };
}
