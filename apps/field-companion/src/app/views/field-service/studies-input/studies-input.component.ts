import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DecreaseStudies, IncreaseStudies} from "../../../core/store/reports/daily-reports.actions";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {Observable} from "rxjs";
import {selectCurrentDailyReportStudies} from "../../../core/store/reports/daily-reports.selectors";

@Component({
  selector: 'app-studies-input',
  templateUrl: './studies-input.component.html',
  styleUrls: ['./studies-input.component.scss']
})
export class StudiesInputComponent implements OnInit
{
  public currentStudies$: Observable<{ value: number }>
  public hideMainNavigation = true;

  constructor(private store: Store<ApplicationState>, private router: Router)
  {
  }

  public ngOnInit(): void
  {
    this.currentStudies$ = this.store.pipe(select(selectCurrentDailyReportStudies));
  }

  public done()
  {
    this.router.navigate(["field-service"]);
  }

  public increase()
  {
    this.store.dispatch(IncreaseStudies());
  }

  public decrease()
  {
    this.store.dispatch(DecreaseStudies());
  }
}
