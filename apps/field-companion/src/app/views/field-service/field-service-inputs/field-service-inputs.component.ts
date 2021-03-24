import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {UpsertDailyReport} from "../../../core/store/reports/daily-reports.actions";
import {selectCurrentDailyReport} from "../../../core/store/reports/daily-reports.selectors";
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {InputDurationComponent} from "../input-duration/input-duration.component";
import {DurationService} from "../../../core/services/duration.service";
import {DailyReport} from "@territory-offline-workspace/shared-interfaces";

@Component({
  selector: 'app-field-service-inputs',
  templateUrl: './field-service-inputs.component.html',
  styleUrls: ['./field-service-inputs.component.scss']
})
export class FieldServiceInputsComponent implements OnInit
{
  @Input()
  public chosenDay: number;

  public durationControl = new FormControl();
  public currentDailyReport$: Observable<DailyReport>

  constructor(private store: Store<ApplicationState>,
              private durationService: DurationService,
              private dialog: MatDialog)
  {
  }

  public ngOnInit(): void
  {
    this.durationControl.setValue(120);
    this.currentDailyReport$ = this.store.pipe(select(selectCurrentDailyReport));
  }

  public showDurationInput()
  {
    this.dialog.open(InputDurationComponent, {
      panelClass: "duration-input-modal",
      backdropClass: "duration-input-modal-backdrop"
    })
  }

  public padDuration(value: number): string
  {
    return this.durationService.padDuration(value);
  }

  public increaseDuration(dailyReport: DailyReport)
  {
    this.durationService.increase(dailyReport);
  }

  public decreaseDuration(dailyReport: DailyReport)
  {
    this.durationService.decrease(dailyReport);
  }

  public increase(propName: string, dailyReport: DailyReport, step: number)
  {
    this.store.dispatch(UpsertDailyReport({
      dailyReport: {
        ...dailyReport,
        [propName]: dailyReport[propName] + step
      }
    }));
  }

  public decrease(propName: string, dailyReport: DailyReport, step: number)
  {
    if (dailyReport[propName] >= step)
    {
      this.store.dispatch(UpsertDailyReport({
        dailyReport: {
          ...dailyReport,
          [propName]: dailyReport[propName] - step
        }
      }));
    }
  }
}
