import {Pipe, PipeTransform} from '@angular/core';
import {createDurationPhrase} from "../utils/usefull.functions";

@Pipe({
  name: 'durationPhrase'
})
export class DurationPhrasePipe implements PipeTransform
{
  public transform(value: Date, ...args: unknown[]): string
  {
    return createDurationPhrase(value);
  }
}
