import {Pipe, PipeTransform} from '@angular/core';
import {Tag} from "@territory-offline-workspace/api";

@Pipe({
  name: 'searchTag'
})
export class SearchTagPipe implements PipeTransform
{

  public transform(tags: Tag[], searchValue: string): Tag[]
  {
    if (!searchValue || searchValue.length === 0)
    {
      return tags;
    }

    return tags.filter(tag => tag.name.toLowerCase().includes(searchValue.toLowerCase()));
  }
}
