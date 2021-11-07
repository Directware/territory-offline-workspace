import { Tag } from './tag.model';
import { TagSymbol } from './tag-symbol.enum';
import { v4 as uuid } from 'uuid';

export function createTag(tagProperties: Partial<Tag> = {}): Tag {
  return {
    id: uuid(),
    creationTime: new Date(),
    name: 'Tag',
    color: '#151515',
    symbol: TagSymbol.NONE,
    metaInfos: [],
    ...tagProperties,
  };
}
