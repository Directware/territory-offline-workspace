import {Pipe, PipeTransform} from '@angular/core';
import {createDurationPhrase} from "../../utils/usefull.functions";
import {VisitBan} from "@territory-offline-workspace/api";

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
