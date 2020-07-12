import {Pipe, PipeTransform} from '@angular/core';
import {VisitBan} from "../../store/visit-bans/model/visit-ban.model";
import {createDurationPhrase} from "../../utils/usefull.functions";

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
