import {Drawing, Territory} from "@territory-offline-workspace/api";
import { v4 as uuid4 } from 'uuid';
import * as Turf from "@turf/turf";

export class GeoJsonParseService
{
  constructor()
  {
  }

  public readGEOJson(geoJson: any, propMappings: any = {}): { t: Territory, d: Drawing }[]
  {
    if (!this.isGEOJsonSchema(geoJson))
    {
      throw new Error("[GeoJsonParseService] Not a GEOJson schema!");
    }

    const parsedData = [];
    this.onlyPolygons(geoJson).forEach((feature, index) =>
    {
      const drawing = this.createDrawing();
      const territory = this.createTerritory(drawing.id);

      const idx = index + 1;
      territory.name = propMappings.name ? feature.properties[propMappings.name] : `Territory ${idx}`;
      territory.key = propMappings.key ? feature.properties[propMappings.key] : `${idx.toString(10).padStart(3, "0")}`;
      territory.populationCount = propMappings.populationCount ? feature.properties[propMappings.populationCount] : 0;

      drawing.featureCollection = Turf.featureCollection([Turf.feature(feature.geometry)]);

      parsedData.push({
        t: territory,
        d: drawing
      })
    });

    return parsedData;
  }

  public isGEOJsonSchema(geoJson: any): boolean
  {
    let isGEOJson = false;
    if (geoJson && geoJson["type"] && geoJson["features"] && geoJson["features"])
    {
      isGEOJson = geoJson["features"].filter(feature => !feature["type"]
        || !feature["properties"]
        || !feature["geometry"]
        || !feature["geometry"]["coordinates"]
        || !feature["geometry"]["type"]).length === 0;
    }

    return isGEOJson;
  }

  public onlyPolygons(geoJson: any)
  {
    if (geoJson && this.isGEOJsonSchema(geoJson))
    {
      return geoJson.features.filter(f => f.geometry.type === "Polygon");
    }
    else
    {
      throw new Error("[GeoJsonParseService] could not filter only polygons!")
    }
  }

  // TODO global factory?
  private createTerritory(drawingId: string): Territory
  {
    return {
      id: uuid4(),
      name: "",
      key: "",
      populationCount: 0,
      tags: [],
      territoryDrawingId: drawingId,
      boundaryNames: [],
      deactivated: false,
      isCreation: false,
      comment: "",
      creationTime: new Date()
    };
  }

  // TODO global factory?
  private createDrawing(): Drawing
  {
    return {
      id: uuid4(),
      featureCollection: {
        type: "Geometry",
        features: []
      },
      printConfiguration: null,
      creationTime: new Date()
    };
  }
}
