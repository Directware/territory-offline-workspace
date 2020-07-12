import {TimedEntity} from '../../../model/db/timed-entity.interface';
import {TagSymbol} from './tag-symbol.enum';

export interface Tag extends TimedEntity
{
  name: string;
  color: string;
  symbol: TagSymbol;
  metaInfos?: { key: string, value: string }[];
}
