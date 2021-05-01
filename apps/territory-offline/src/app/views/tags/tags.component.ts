import { TranslateService } from '@ngx-translate/core';
import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {selectTags} from '../../core/store/tags/tags.selectors';
import {DeleteTag, UpsertTag} from '../../core/store/tags/tags.actions';
import {Router} from '@angular/router';
import {selectAllTerritories} from "../../core/store/territories/territories.selectors";
import {selectPublishers} from "../../core/store/publishers/publishers.selectors";
import {take, tap} from "rxjs/operators";
import {BulkUpsertPublisher} from "../../core/store/publishers/publishers.actions";
import {BulkUpsertTerritory} from "../../core/store/territories/territories.actions";
import {Tag} from "@territory-offline-workspace/shared-interfaces";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit
{
  public searchValue: string;
  public isEditingMode: boolean;
  public tags$: Observable<Tag[]>;

  constructor(private router: Router,
              private store: Store<ApplicationState>,
              private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
    this.router.navigate([{outlets: {'second-thread': null}}]);
    this.tags$ = this.store.pipe(select(selectTags));
  }

  public isNewlyAdded(tag: Tag): boolean
  {
    const now = new Date();
    const tenMinutes = 1000 * 60 * 10;
    return tag.creationTime && (now.getTime() - tag.creationTime.getTime() < tenMinutes)
  }

  public changeColor(tag: Tag)
  {
    this.store.dispatch(UpsertTag({tag: tag}));
  }

  public deleteTag(tag: Tag)
  {
    this.translate.get(['tag.reallyDelete', 'tag.removeAllReferences']).pipe(take(1)).subscribe((translations: {[key: string]: string}) => {
      const canDelete = confirm(translations["tag.reallyDelete"]);

      if (canDelete)
      {
        combineLatest([
          this.store.pipe(select(selectAllTerritories)),
          this.store.pipe(select(selectPublishers))
        ]).pipe(
          take(1),
          tap(([territories, publisher]) =>
          {
            const usedOnTerritories = territories.filter(t => t.tags?.includes(tag.id));
            const usedOnPublisher = publisher.filter(p => p.tags?.includes(tag.id));

            let ok = true;
            if (usedOnPublisher.length > 0 || usedOnTerritories.length > 0)
            {
              ok = confirm(translations['tag.removeAllReferences']);
            }

            if (ok)
            {
              this.store.dispatch(BulkUpsertTerritory({
                territories: usedOnTerritories.map(t => ({
                  ...t,
                  tags: t.tags.filter(tId => tId !== tag.id)
                }))
              }));

              this.store.dispatch(BulkUpsertPublisher({
                publisher: usedOnPublisher.map(p => ({
                  ...p,
                  tags: p.tags.filter(tId => tId !== tag.id)
                }))
              }));

              this.store.dispatch(DeleteTag({tag: tag}));
            }
          })
        ).subscribe();
      }
    });
  }
}
