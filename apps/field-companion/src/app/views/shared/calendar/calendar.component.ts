import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CalendarCell } from './model/calendar-cell.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CalendarDatasource } from './model/calendar-datasource.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  @HostBinding('class.app-calendar')
  public appCalendarClass = true;

  @Input('dataSource')
  public dataSource$: BehaviorSubject<CalendarDatasource>;

  @Input()
  public sundayLast: boolean;

  @Output()
  public onDateChoose = new EventEmitter<CalendarCell>();

  public weekDays: string[] = [];
  private weekDayPaddingSundayLast = [6, 0, 1, 2, 3, 4, 5];
  private weekDayPaddingSundayFirst = [0, 1, 2, 3, 4, 5, 6];

  public grid: CalendarCell[];
  public chosenDay: CalendarCell;

  private destroyer = new Subject();

  constructor() {}

  public ngOnInit(): void {
    this.initWeekDays();

    if (this.dataSource$) {
      this.dataSource$
        .pipe(
          tap((data) =>
            this.sundayLast
              ? this.populateWithMondayFirst(data)
              : this.populateWithSundayFirst(data)
          ),
          takeUntil(this.destroyer)
        )
        .subscribe();
    } else {
      console.error('[CalendarComponent] no datasource!');
    }
  }

  public ngOnDestroy(): void {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public chooseDate(cell: CalendarCell) {
    if (!!cell.date) {
      if (!!this.chosenDay && cell.dayIndex === this.chosenDay.dayIndex) {
        this.chosenDay = null;
        this.onDateChoose.emit(null);
      } else {
        this.chosenDay = cell;
        this.onDateChoose.emit(cell);
      }
    }
  }

  private populateWithMondayFirst(data: CalendarDatasource) {
    this.grid = [];
    const firstDayOfMonth = new Date(data.year, data.month, 1).getDay();

    for (let i = 0; i < this.weekDayPaddingSundayLast[firstDayOfMonth]; i++) {
      this.grid.push({
        text: '',
        dayIndex: -1,
        date: null,
      });
    }

    this.populate(data);
  }

  private populateWithSundayFirst(data: CalendarDatasource) {
    this.grid = [];
    const firstDayOfMonth = new Date(data.year, data.month, 1).getDay();

    for (let i = 0; i < this.weekDayPaddingSundayFirst[firstDayOfMonth]; i++) {
      this.grid.push({
        text: '',
        dayIndex: -1,
        date: null,
      });
    }

    this.populate(data);
  }

  private populate(data: CalendarDatasource) {
    let dayIndex = 1;
    const totalDaysInMonth = this.daysInMonth(data.month, data.year);
    const todayHelper = new Date();
    const today = new Date(
      todayHelper.getFullYear(),
      todayHelper.getMonth(),
      todayHelper.getDate()
    );

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (dayIndex <= totalDaysInMonth) {
          const cellDate = new Date(data.year, data.month, dayIndex);
          const isToday = cellDate.getTime() === today.getTime();

          this.grid.push({
            text: dayIndex + '',
            dayIndex,
            date: cellDate,
            hasDot: isToday,
            hasData: data.dataExistOnDates.map((d) => d.getTime()).includes(cellDate.getTime()),
          });
        }
        dayIndex++;
      }
    }
  }

  private daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  private initWeekDays() {
    this.weekDays.push(
      'week.shortNames.tuesday',
      'week.shortNames.wednesday',
      'week.shortNames.thursday',
      'week.shortNames.friday',
      'week.shortNames.saturday'
    );

    if (this.sundayLast) {
      this.weekDays.unshift('week.shortNames.monday');
      this.weekDays.push('week.shortNames.sunday');
    } else {
      this.weekDays.unshift('week.shortNames.monday');
      this.weekDays.unshift('week.shortNames.sunday');
    }
  }
}
