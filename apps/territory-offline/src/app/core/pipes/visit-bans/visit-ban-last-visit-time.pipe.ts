import {Pipe, PipeTransform} from '@angular/core';
import {VisitBan} from "@territory-offline-workspace/shared-interfaces";
import {createDurationPhrase} from "@territory-offline-workspace/shared-utils";

@Pipe({
  name: 'visitBanLastVisit'
})
export class VisitBanLastVisitTimePipe implements PipeTransform
{
  constructor()
  {
  }

  public transform(visitBan: VisitBan): string
  {
    if (!visitBan)
    {
      return "-";
    }

    if (visitBan.lastVisit)
    {
      return createDurationPhrase(visitBan.lastVisit);
    }

    return createDurationPhrase(visitBan.creationTime);
  }
}
