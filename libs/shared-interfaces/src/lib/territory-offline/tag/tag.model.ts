import { TagSymbol } from './tag-symbol.enum';
import { TimedEntity } from './../../common/timed-entity.model';

export interface Tag extends TimedEntity {
  name: string;
  color: string;
  symbol: TagSymbol;
  metaInfos?: { key: string; value: string }[];
}
