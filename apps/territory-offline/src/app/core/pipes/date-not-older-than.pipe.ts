import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateNotOlderThan',
})
export class DateNotOlderThanPipe implements PipeTransform {
  constructor() {}

  public transform(date: Date | string, ...args: any[]): unknown {
    const dateAsMoment = moment(date);
    const thresholdInYears = parseInt(args[0], 10);

    if (thresholdInYears) {
      const today = new Date();
      const thresholdInYears = parseInt(args[0], 10);
      const dateInThePast = new Date(
        today.getFullYear() - thresholdInYears,
        today.getMonth(),
        today.getDate()
      );

      if (dateAsMoment.isBefore(dateInThePast, 'day')) {
        return '';
      }
    }

    return dateAsMoment.format('DD.MM.YYYY');
  }
}
