import {TimedEntity} from "./../../common/timed-entity.model";

export interface Congregation extends TimedEntity
{
  name: string;
  languageCode: string;
  language: string;
  hashedName: string;
}
