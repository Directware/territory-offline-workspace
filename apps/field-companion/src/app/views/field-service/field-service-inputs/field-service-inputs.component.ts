import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {UpsertDailyReport} from "../../../core/store/reports/daily-reports.actions";
import {selectCurrentDailyReport} from "../../../core/store/reports/daily-reports.selectors";
import {combineLatest, Observable} from "rxjs";
import {DailyReport} from "../../../core/store/reports/model/daily-report.model";
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {InputDurationComponent} from "../input-duration/input-duration.component";
import {selectDurationStep} from "../../../core/store/settings/settings.selectors";
import {map} from "rxjs/operators";

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
  public durationOptions = [];

  public currentDailyReportWithDurationStep$: Observable<{dailyReport: DailyReport, durationStep: number}>

  constructor(private store: Store<ApplicationState>, private dialog: MatDialog)
  {
  }

  public ngOnInit(): void
  {
    /*
    for(let i = 15; i < 120; i = i + 15)
    {
      this.durationOptions.push({text: i, value: i});
    }
    */
    this.durationOptions.push({text: "15m", value: 15});
    this.durationOptions.push({text: "30m", value: 30});
    this.durationOptions.push({text: "1h", value: 60});
    this.durationOptions.push({text: "1.5h", value: 90});
    this.durationOptions.push({text: "2h", value: 120});
    this.durationOptions.push({text: "3h", value: 120});
    this.durationOptions.push({text: "4h", value: 120});

    this.durationControl.setValue(120);
    this.currentDailyReportWithDurationStep$ = combineLatest([
      this.store.pipe(select(selectCurrentDailyReport)),
      this.store.pipe(select(selectDurationStep))
    ]).pipe(map(([report, durationStep]) => ({dailyReport: report, durationStep: durationStep})) );
  }

  public showDurationInput()
  {
    this.dialog.open(InputDurationComponent)
  }

  public padDuration(value: number): string
  {
    if (!value)
    {
      return "00:00";
    }
    const hours = Math.floor(value / 60).toString().padStart(2, "0");
    const minutes = (value - (Math.floor(value / 60) * 60)).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
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
