import {Pipe, PipeTransform} from '@angular/core';
import {Congregation} from "@territory-offline-workspace/shared-interfaces";

@Pipe({
  name: 'searchCongregation'
})
export class SearchCongregationPipe implements PipeTransform
{
  public transform(congregations: Congregation[], searchValue: string): Congregation[]
  {
    if (!searchValue || searchValue.length === 0)
    {
      return congregations;
    }

    return congregations.filter(c => c.name.toLowerCase().includes(searchValue.toLowerCase()));
  }
}
