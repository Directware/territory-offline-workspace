import {Feature} from "@territory-offline-workspace/api";

export interface GeocodingResult
{
  type: string;
  query: string[];
  features: Feature[];
  attribution: string;
}
