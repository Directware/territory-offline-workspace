import {TimedEntity} from "@territory-offline-workspace/api";

export interface Congregation extends TimedEntity
{
  name: string;
  languageCode: string;
  language: string;
  hashedName: string;
}
