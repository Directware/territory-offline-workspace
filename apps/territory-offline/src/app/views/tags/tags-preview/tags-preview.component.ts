import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {Observable} from "rxjs";
import {selectTagsByIds} from "../../../core/store/tags/tags.selectors";
import {Tag} from "@territory-offline-workspace/shared-interfaces";

@Component({
  selector: 'app-tags-preview',
  templateUrl: './tags-preview.component.html',
  styleUrls: ['./tags-preview.component.scss']
})
export class TagsPreviewComponent implements OnInit
{
  @Input()
  public tagIds: string[];

  public tags$: Observable<Tag[]>;

  constructor(private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    this.tags$ = this.store.pipe(select(selectTagsByIds, this.tagIds));
  }

  public hexToRgbA(hex: string)
  {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex))
    {
      c = hex.substring(1).split('');
      if (c.length == 3)
      {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.2)';
    }
  }
}
