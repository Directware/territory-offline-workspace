import {DatabaseEntity} from './database-entity.model';

export interface TimedEntity extends DatabaseEntity
{
  creationTime: Date;
  lastUpdated?: Date;
}
