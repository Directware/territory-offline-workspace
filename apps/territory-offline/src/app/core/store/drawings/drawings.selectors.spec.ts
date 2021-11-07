import { selectAllDrawings } from './drawings.selectors';

describe('drawing.selectors.spec', () => {
  it('should filter drawings', () => {
    const drawingAsNull = [null];
    const drawingWithNoFeatureCollection = [{ id: 'd-id-1' }];
    const drawingWithNoFeatures = [{ id: 'd-id-2', featureCollection: {} }];
    const drawingWithNoTerritoryReference = [
      { id: 'd-id-3', featureCollection: { features: [{}] } },
    ];

    const result1 = selectAllDrawings.projector(null, [], [], {});
    expect(JSON.stringify(result1)).toBe('[]');

    const result2 = selectAllDrawings.projector(drawingAsNull, [], [], {});
    expect(JSON.stringify(result2)).toBe('[]');

    const result3 = selectAllDrawings.projector(drawingWithNoFeatureCollection, [], [], {});
    expect(JSON.stringify(result3)).toBe('[]');

    const result4 = selectAllDrawings.projector(drawingWithNoFeatures, [], [], {});
    expect(JSON.stringify(result4)).toBe('[]');

    const result5 = selectAllDrawings.projector(drawingWithNoTerritoryReference, [], [], {});
    expect(JSON.stringify(result5)).toBe('[]');
  });

  it('should evaluate drawing properties (not assigned)', () => {
    const drawings = [{ id: 'd-id-1', featureCollection: { features: [{}] } }];
    const territories = [{ id: 't-id-1', key: 'XYZ', territoryDrawingId: 'd-id-1' }];
    const assignments = [{ territoryId: 't-id-1', startTime: new Date(), endTime: new Date() }];

    const result = selectAllDrawings.projector(drawings, assignments, territories, {
      processingBreakInMonths: 4,
      overdueBreakInMonths: 4,
    });

    expect(result[0].featureCollection.features[0].properties).toMatchObject({
      color: '#15C880',
      status: '#15C880',
      isAssigned: false,
      durationPhrase: 'XYZ (00M 00T)',
    });
  });

  it('should evaluate drawing properties (assigned)', () => {
    const drawings = [{ id: 'd-id-1', featureCollection: { features: [{}] } }];
    const territories = [{ id: 't-id-1', key: 'XYZ', territoryDrawingId: 'd-id-1' }];
    const assignments = [{ territoryId: 't-id-1', startTime: new Date() }];

    const result = selectAllDrawings.projector(drawings, assignments, territories, {
      processingBreakInMonths: 4,
      overdueBreakInMonths: 4,
    });

    expect(result[0].featureCollection.features[0].properties).toMatchObject({
      color: '#2079C2',
      status: '#2079C2',
      isAssigned: true,
      durationPhrase: 'XYZ (00M 00T)',
    });
  });
});
