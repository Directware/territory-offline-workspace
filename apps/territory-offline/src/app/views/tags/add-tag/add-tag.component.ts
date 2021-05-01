import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../../core/store/index.reducers';
import {UpsertTag, UpsertTagSuccess} from '../../../core/store/tags/tags.actions';
import {v4 as uuid} from 'uuid';
import {LastDoingsService} from "../../../core/services/common/last-doings.service";
import {LastDoingActionsEnum, Tag, TagSymbol} from "@territory-offline-workspace/shared-interfaces";

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit
{
  @Input()
  public alreadyAddedTags: Tag[];

  public newTagName: string;

  constructor(private store: Store<ApplicationState>, private lastDoingsService: LastDoingsService, private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
  }

  public keyPressHandler(e: KeyboardEvent)
  {
    if (e.code === 'Enter')
    {
      this.addNewTag();
    }
  }

  public addNewTag()
  {
    if (this.newTagName && this.newTagName.trim().length > 0)
    {
      const t = this.newTagName.trim().toLowerCase();
      const alreadyExists = this.alreadyAddedTags.filter((tag) => tag.name.trim().toLowerCase() === t).length;
      if (alreadyExists === 0)
      {
        const tagName = this.newTagName.trim();
        this.lastDoingsService.createLastDoingAfter(UpsertTagSuccess, LastDoingActionsEnum.CREATE, tagName);

        this.store.dispatch(UpsertTag({
          tag: {
            id: uuid(),
            creationTime: new Date(),
            name: tagName,
            symbol: TagSymbol.TRIANGLE,
            color: '#000'
          }
        }));
        this.newTagName = '';
      }
      else
      {
        this.translate.get('tag.alreadyExist', {name: t}).pipe(take(1)).subscribe((translation: string) =>
          alert(translation));
      }
    }
  }
}
