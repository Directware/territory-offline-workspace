import {Pipe, PipeTransform} from '@angular/core';
import * as moment from "moment";
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'durationLeftForTerritoryCard'
})
export class DurationLeftForTerritoryCardPipe implements PipeTransform
{
  constructor(private translateService: TranslateService)
  {
  }

  public transform(startTime: string | Date, ...args: number[]): unknown
  {
    const today = moment(new Date());
    const end = moment(startTime).add(args[0], "M");
    const duration = moment.duration(today.diff(end));

    if (end.isAfter(today))
    {
      return `${this.translateService.instant("territories.still")} ${duration.months()}M ${duration.days()}T`;
    }
    else
    {
      return `${this.translateService.instant("territories.toLate")} ${duration.months()}M ${duration.days()}T`;
    }
  }
}
