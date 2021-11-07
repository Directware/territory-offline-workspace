import * as moment from 'moment';

export function monthsPastSince(startDate: Date | string): number {
  const start = moment(startDate);
  const end = moment(new Date());

  return end.diff(start, 'months');
}
