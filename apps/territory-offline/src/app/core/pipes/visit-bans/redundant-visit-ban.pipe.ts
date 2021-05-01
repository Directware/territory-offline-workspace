import {Pipe, PipeTransform} from '@angular/core';
import {VisitBan} from "@territory-offline-workspace/shared-interfaces";
import {compareVisitBansWithNames} from "@territory-offline-workspace/shared-utils";

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
