import { Drawing } from '@territory-offline-workspace/shared-interfaces';

export function mergeDrawings(drawings: Drawing[]): Drawing {
  if (drawings && drawings.length > 0) {
    const drawingsWithFeatures = drawings.filter(
      (drawing) => drawing.featureCollection && drawing.featureCollection.features
    );

    drawingsWithFeatures.forEach((drawing) =>
      drawing.featureCollection.features.forEach(
        (feature) => (feature.properties['drawingId'] = drawing.id)
      )
    );

    return drawingsWithFeatures.reduce((result, current) => ({
      ...result,
      featureCollection: {
        ...result.featureCollection,
        features: [...result.featureCollection.features, ...current.featureCollection.features],
      },
    }));
  }

  return null;
}
