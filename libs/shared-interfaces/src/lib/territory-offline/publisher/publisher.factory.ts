import { Publisher } from './publisher.model';
import { v4 as uuid } from 'uuid';

export function createPublisher(publisherProperties: Partial<Publisher> = {}): Publisher {
  return {
    id: uuid(),
    creationTime: new Date(),
    name: 'Name',
    firstName: 'First name',
    email: '',
    phone: '',
    tags: [],
    dsgvoSignature: null,
    isDeactivated: false,
    ...publisherProperties,
  };
}
