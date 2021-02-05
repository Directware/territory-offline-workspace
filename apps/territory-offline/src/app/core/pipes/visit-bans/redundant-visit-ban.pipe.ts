import {Pipe, PipeTransform} from '@angular/core';
import {compareVisitBansWithNames, VisitBan} from "@territory-offline-workspace/api";

@Pipe({
  name: 'isRedundantVisitBan'
})
export class RedundantVisitBanPipe implements PipeTransform
{
  constructor()
  {
  }

  public transform(visitBan: VisitBan, visitBans: VisitBan[]): boolean
  {
    return visitBan && visitBans && visitBans.filter(vb => compareVisitBansWithNames(vb, visitBan)).length > 1;
  }
}
