import {TimedEntity} from "./../common/timed-entity.model";

export interface AbstractDatabase
{
  readonly database: any;
  platform: 'ios' | 'android' | 'electron' | 'web';

  init();

  open();

  load(prefix: string, excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>;

  upsert(prefix: string, entity: TimedEntity, excludeCongregationPrefix?: boolean): Promise<TimedEntity>;

  delete(prefix: string, entity: TimedEntity, excludeCongregationPrefix?: boolean): Promise<TimedEntity>;

  bulkUpsert(prefix: string, entities: TimedEntity[], excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>;

  bulkDelete(prefix: string, entities: TimedEntity[], excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>;

  clear();

  clearAllWithPrefix(prefix: string);
}
