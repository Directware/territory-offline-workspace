import { GeoJsonParseService } from './geo-json-parse.service';

describe('Test GEOJson parsing', () => {
  const GEOJson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [10.839729309082031, 48.37244417837807],
              [10.825653076171873, 48.35967096890353],
              [10.843162536621092, 48.35122976936477],
              [10.858955383300781, 48.3548801894373],
              [10.865135192871094, 48.369935407913786],
              [10.839729309082031, 48.37244417837807],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [10.882644653320312, 48.37107577344733],
              [10.877494812011719, 48.34803543726875],
              [10.911827087402344, 48.34187437419834],
              [10.930366516113281, 48.35944284676355],
              [10.915946960449219, 48.37244417837807],
              [10.882644653320312, 48.37107577344733],
            ],
          ],
        },
      },
    ],
  };

  it('should validate GEO Json schema', () => {
    const parseService = new GeoJsonParseService();
    let result = parseService.isGEOJsonSchema(GEOJson);
    expect(result).toEqual(true);

    result = parseService.isGEOJsonSchema({});
    expect(result).toEqual(false);
  });

  it('should throw error on no geo json', () => {
    const parseService = new GeoJsonParseService();
    expect(() => parseService.readGEOJson({} as any)).toThrowError();
  });

  it('should create territory and drawing from GEOJson format', () => {
    const parseService = new GeoJsonParseService();

    const result = parseService.readGEOJson(GEOJson);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ t: {}, d: {} });
    expect(result[0].t.territoryDrawingId).toEqual(result[0].d.id);
  });
});
