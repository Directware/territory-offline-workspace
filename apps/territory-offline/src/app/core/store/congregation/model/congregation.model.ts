import {TimedEntity} from '../../../model/db/timed-entity.interface';

export interface Congregation extends TimedEntity
{
  name: string;
  languageCode: string;
  language: string;
  hashedName: string;
}
