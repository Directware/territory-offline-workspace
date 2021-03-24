import {v4 as uuid} from 'uuid';
import {Territory} from "./territory.model";

export function createTerritory(territoryProperties: Partial<Territory> = {}): Territory
{
  return {
    id: uuid(),
    creationTime: new Date(),
    name: "Territory",
    key: "A42",
    populationCount: 0,
    tags: [],
    territoryDrawingId: null,
    boundaryNames: [],
    deactivated: false,
    isCreation: false,
    comment: "",
    ...territoryProperties
  };
}
