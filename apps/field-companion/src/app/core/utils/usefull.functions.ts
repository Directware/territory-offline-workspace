import { Drawing } from "@territory-offline-workspace/shared-interfaces";

export function mergeDrawings(drawings: Drawing[]): Drawing {
  if (drawings && drawings.length > 0) {
    const drawingsWithFeatures = drawings.filter(
      (drawing) =>
        drawing.featureCollection && drawing.featureCollection.features
    );

    const tmp = drawingsWithFeatures.map((drawing) => {
      return {
        ...drawing,
        featureCollection: {
          ...drawing.featureCollection,
          features: [
            ...drawing.featureCollection.features.map((f) => ({
              ...f,
              properties: { ...f.properties, drawingId: drawing.id },
            })),
          ],
        },
      };
    });

    return tmp.reduce((result, current) => ({
      ...result,
      featureCollection: {
        ...result.featureCollection,
        features: [
          ...result.featureCollection.features,
          ...current.featureCollection.features,
        ],
      },
    }));
  }

  return null;
}
