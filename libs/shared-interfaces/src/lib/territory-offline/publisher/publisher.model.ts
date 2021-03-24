import {TimedEntity} from "./../../common/timed-entity.model";

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
