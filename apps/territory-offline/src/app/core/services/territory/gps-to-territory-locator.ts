import { Drawing, Territory } from '@territory-offline-workspace/shared-interfaces';
import * as Turf from '@turf/turf';

export class GpsToTerritoryLocator {
  constructor(private territories: Territory[], private drawings: Drawing[]) {}

  public locate(gpsPosition: { lat: number; lng: number }): string {
    let territoryId = null;
    if (gpsPosition.lat && gpsPosition.lng && !isNaN(gpsPosition.lat) && !isNaN(gpsPosition.lng)) {
      this.drawings.forEach((d) =>
        d.featureCollection.features
          .filter((f) => f.geometry.type === 'Polygon') // Wichtig, sonst fliegt ein Fehler in "booleanPointInPolygon"
          .forEach((f: any) => {
            const point = Turf.point([gpsPosition.lng, gpsPosition.lat]);

            let isIn = false;
            try {
              isIn = Turf.booleanPointInPolygon(point, f);
            } catch (e) {
              console.warn(e);
              console.debug(point, f);
            }

            if (isIn) {
              territoryId = this.territories.filter((t) => t.territoryDrawingId === d.id)[0].id;
            }
          })
      );
    }
    return territoryId;
  }
}
