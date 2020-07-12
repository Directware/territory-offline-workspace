import {DatabaseEntity} from './database-entity.interface';

export interface TimedEntity extends DatabaseEntity
{
  creationTime: Date;
  lastUpdated?: Date;
}
