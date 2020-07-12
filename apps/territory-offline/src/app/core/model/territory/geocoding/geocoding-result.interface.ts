import {Feature} from '../../../store/drawings/model/feature.model';

export interface GeocodingResult
{
  type: string;
  query: string[];
  features: Feature[];
  attribution: string;
}
