import {Drawing} from "@territory-offline-workspace/shared-interfaces";
import { v4 as uuid4 } from 'uuid';

export function createDrawing(): Drawing
{
  return {
    id: uuid4(),
    creationTime: new Date(),
    featureCollection: {
      type: "",
      features: [{
        type: "Feature",
        properties: [],
        geometry: {
          type: "Polygon",
          coordinates: [Math.random(), Math.random()]
        }
      }]
    }
  };
}
