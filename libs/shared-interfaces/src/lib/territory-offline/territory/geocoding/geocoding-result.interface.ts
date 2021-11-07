import { Feature } from './../../drawing/feature.model';

export interface GeocodingResult {
  type: string;
  query: string[];
  features: Feature[];
  attribution: string;
}
