import {Pipe, PipeTransform} from '@angular/core';
import {VisitBan} from "@territory-offline-workspace/api";

@Pipe({
  name: 'isOrphanVisitBan'
})
export class OrphanVisitBanPipe implements PipeTransform
{
  constructor()
  {
  }

  public transform(visitBan: VisitBan): boolean
  {
    return !visitBan.gpsPosition || !visitBan.territoryId || !visitBan.gpsPosition.lat || !visitBan.gpsPosition.lng;
  }
}
