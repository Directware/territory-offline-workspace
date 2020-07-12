import {TimedEntity} from '../../../model/db/timed-entity.interface';

export interface Publisher extends TimedEntity
{
  name: string;
  firstName: string;
  email: string;
  phone: string;
  tags: string[];
  dsgvoSignature?: string;
  isDeactivated?: boolean;
}
