import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../../core/store/index.reducers';
import {Observable, Subject} from 'rxjs';
import {selectTagEntities, selectTags} from '../../../core/store/tags/tags.selectors';
import {debounceTime, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {Dictionary} from '@ngrx/entity';
import {Tag} from "@territory-offline-workspace/api";

@Component({
  selector: 'app-assigned-tags',
  templateUrl: './assigned-tags.component.html',
  styleUrls: ['./assigned-tags.component.scss']
})
export class AssignedTagsComponent implements OnInit, OnDestroy
{
  @Input()
  public assignedTags: FormControl;

  @Input()
  public readonly: boolean;

  public newTagName = new FormControl();
  public allTags$: Observable<Tag[]>;
  public allTagsEntities$: Observable<Dictionary<Tag>>;
  public searchResults: Tag[] = [];
  public tagToBeDeleted: string;
  private destroyer = new Subject();

  constructor(private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    this.allTags$ = this.store.pipe(select(selectTags));
    this.allTagsEntities$ = this.store.pipe(select(selectTagEntities));

    this.newTagName
      .valueChanges
      .pipe(
        takeUntil(this.destroyer),
        withLatestFrom(this.allTags$),
        debounceTime(400),
        tap(([value, tags]: [string, Tag[]]) =>
        {
          if (value && value.length > 0)
          {
            this.searchResults = tags.filter(t => t.name.toLowerCase().startsWith(value.trim().toLowerCase()));
          } else
          {
            this.searchResults = [];
          }
        })
      ).subscribe();
  }

  public ngOnDestroy(): void
  {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public removeTag(tagId: string)
  {
    if (!this.tagToBeDeleted || this.tagToBeDeleted !== tagId)
    {
      this.tagToBeDeleted = tagId;
      setTimeout(() => this.tagToBeDeleted = null, 1500);
      return;
    }

    const currentTagIds = this.assignedTags.value as string[];
    this.assignedTags.setValue([...currentTagIds.filter(id => id !== tagId)]);
    this.assignedTags.markAsDirty();
  }

  public addTag(tag: Tag)
  {
    if(tag)
    {
      const alreadyAddedTags = this.assignedTags.value;
      this.assignedTags.setValue([...alreadyAddedTags, tag.id]);
      this.newTagName.setValue('');
      this.assignedTags.markAsDirty();
    }
  }
}
