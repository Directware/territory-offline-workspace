import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {selectPublishersByFirstNameLetter} from '../../core/store/publishers/publishers.selectors';
import {map} from "rxjs/operators";
import {Publisher} from "@territory-offline-workspace/api";

@Component({
  selector: 'app-preachers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublishersComponent implements OnInit
{
  public publishersByLetters$: Observable<Publisher[][]>;
  public search: { value: string};
  public currentPublisherId: string;

  constructor(private router: Router, private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    this.router.navigate([{outlets: {'second-thread': null}}]);
    this.publishersByLetters$ = this.store.pipe(select(selectPublishersByFirstNameLetter), map(pub => !pub || pub.length === 0 ? null : pub));
  }

  public createPublisher()
  {
    this.router.navigate([{outlets: {'second-thread': ['publisher']}}]);
  }

  public editPublisher(publisher: Publisher)
  {
    this.currentPublisherId = publisher.id;
    this.router.navigate([{outlets: {'second-thread': ['publisher', publisher.id]}}]);
  }
}
