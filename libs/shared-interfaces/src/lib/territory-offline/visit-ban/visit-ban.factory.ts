import { VisitBan } from './visit-ban.model';
import { v4 as uuid } from 'uuid';

export function createVisitBan(visitBanProperties: Partial<VisitBan> = {}): VisitBan {
  return {
    id: uuid(),
    creationTime: new Date(),
    name: '',
    street: '',
    streetSuffix: '',
    territoryId: null,
    tags: [],
    city: '',
    comment: '',
    ...visitBanProperties,
  };
}
