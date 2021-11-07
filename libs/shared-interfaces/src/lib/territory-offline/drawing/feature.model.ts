export interface Feature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: any;
  text: string;
  place_name: string;
  bbox: number[];
  center: number[];
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  context: {
    id: string;
    osm_id: string;
    text: string;
  }[];
}
