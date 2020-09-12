import {Component, Input, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../../core/store/index.reducers';
import {selectPublishers} from '../../../core/store/publishers/publishers.selectors';
import {FormControl} from '@angular/forms';
import {debounceTime, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {Publisher} from "@territory-offline-workspace/api";

@Component({
  selector: 'app-add-publisher',
  templateUrl: './add-publisher.component.html',
  styleUrls: ['./add-publisher.component.scss']
})
export class AddPublisherComponent implements OnInit
{
  @Input()
  public vFormControl: FormControl;

  public allPublishers$: Observable<Publisher[]>;
  public searchPublisherControl = new FormControl();
  public searchResults: Publisher[] = [];
  private destroyer = new Subject();

  constructor(private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    this.allPublishers$ = this.store.pipe(select(selectPublishers), tap(publishers => this.setInitialPublisher(publishers)));

    this.searchPublisherControl
      .valueChanges
      .pipe(
        takeUntil(this.destroyer),
        withLatestFrom(this.allPublishers$),
        debounceTime(400),
        tap(([value, publishers]: [string, Publisher[]]) =>
        {
          if (value && value.length > 0)
          {
            this.searchResults = publishers.filter(p =>
              p.name.toLowerCase().startsWith(value.trim().toLowerCase()) ||
              p.firstName.toLowerCase().startsWith(value.trim().toLowerCase())
            );
          } else
          {
            this.searchResults = [];
          }
        })
      ).subscribe();
  }

  public addPublisher(publisher: Publisher)
  {
    this.vFormControl.setValue(publisher.id);
    this.vFormControl.markAsDirty();
    this.searchResults = [];
    this.searchPublisherControl.setValue(`${publisher.name} ${publisher.firstName}`, {emitEvent: false});
  }

  private setInitialPublisher(publishers: Publisher[])
  {
    if (this.vFormControl.value)
    {
      const publisher = publishers.filter(p => p.id === this.vFormControl.value)[0];

      if (publisher)
      {
        this.searchPublisherControl.setValue(`${publisher.name} ${publisher.firstName}`, {emitEvent: false});
      }
    }
  }
}
