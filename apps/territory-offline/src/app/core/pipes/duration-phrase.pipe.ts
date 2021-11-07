import { Pipe, PipeTransform } from '@angular/core';
import { createDurationPhrase } from '@territory-offline-workspace/shared-utils';

@Pipe({
  name: 'durationPhrase',
})
export class DurationPhrasePipe implements PipeTransform {
  public transform(value: Date, ...args: unknown[]): string {
    return createDurationPhrase(value);
  }
}
