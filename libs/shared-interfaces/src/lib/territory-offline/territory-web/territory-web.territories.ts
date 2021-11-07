import { Geometry } from '@turf/turf';

export interface TerritoryWebTerritories {
  ExportedBy: string;
  TWGroupId: string;
  TWGroupName: string;
  TWType: string;
  features: TerritoryWebTerritory[];
  type: string;
}

export interface TerritoryWebTerritory {
  geometry: Geometry;
  properties: {
    TWId: string;
    TerritoryNotes: string;
    TerritoryNumber: string;
    TerritoryType: string;
    TerritoryTypeCode: string;
    description: string;
    name: string;
  };
  type: string;
}
