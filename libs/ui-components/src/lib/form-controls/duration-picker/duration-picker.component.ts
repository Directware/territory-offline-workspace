import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {v4 as uuid} from 'uuid';
import {FormControl} from '@angular/forms';
import {IosSelector} from "../common/ios-date-selector.class";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.scss']
})
export class DurationPickerComponent implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  public durationFormControl: FormControl;

  @Output()
  public selected = new EventEmitter();

  public hoursElementId = btoa(uuid());
  public hourSelector: IosSelector;

  public minutesElementId = btoa(uuid());
  public minutesSelector: IosSelector;

  private isInitialising = true;
  private destroyer = new Subject();

  constructor()
  {
  }

  public ngOnInit(): void
  {
    if (!this.durationFormControl)
    {
      console.warn("[DurationPickerComponent] please input a form control!")
    }
  }

  public ngAfterViewInit(): void
  {
    const hoursSource = this.hoursSource();

    this.hourSelector = new IosSelector({
      el: `#${this.hoursElementId}`,
      type: 'infinite',
      source: hoursSource,
      count: hoursSource.length,
      onChange: selected =>
      {
        if (this.isInitialising)
        {
          return;
        }
        const minutes = this.durationFormControl.value ? this.durationFormControl.value.split(":")[1] : 0;
        this.setFormValue(selected.value, minutes || 0);
      }
    });

    const minutesSource = this.minutesSource();
    this.minutesSelector = new IosSelector({
      el: `#${this.minutesElementId}`,
      type: 'infinite',
      source: minutesSource,
      count: minutesSource.length,
      onChange: selected =>
      {
        if (this.isInitialising)
        {
          return;
        }
        const hours = this.durationFormControl.value ? this.durationFormControl.value.split(":")[0] : 0;
        this.setFormValue(hours || 0, selected.value);
      }
    });


    setTimeout(() => this.setInitialValueListener(), 0);
  }

  public ngOnDestroy(): void
  {
    this.hourSelector.destroy();
    this.minutesSelector.destroy();
    this.destroyer.next();
    this.destroyer.complete();
  }

  private setFormValue(hours: number, minutes: number)
  {
    const newValue = `${hours}:${minutes}`;
    this.selected.emit(newValue);
  }

  private hoursSource(): number[]
  {
    const tmp = [];
    for (let i = 0; i < 24; i++)
    {
      tmp.push({text: `${i}`.padStart(2, "0"), value: i});
    }
    return tmp;
  }

  private minutesSource(): number[]
  {
    const tmp = [];
    for (let i = 0; i < 60; i++)
    {
      tmp.push({text: `${i}`.padStart(2, "0"), value: i});
    }
    return tmp;
  }

  private setInitialValueListener()
  {
    this.selectProgrammatically(this.durationFormControl.value);

    this.durationFormControl
      .valueChanges
      .pipe(
        takeUntil(this.destroyer),
        tap((value) => this.selectProgrammatically(value))
      ).subscribe();

    setTimeout(() => this.isInitialising = false, 0);
  }

  private selectProgrammatically(value: string)
  {
    if (value)
    {
      const split = value.split(":");
      const hours = parseInt(split[0], 10);
      const minutes = parseInt(split[1], 10);

      if (this.hourSelector.value !== hours)
      {
        this.hourSelector.select(hours);
      }
      if (this.minutesSelector.value !== minutes)
      {
        this.minutesSelector.select(minutes);
      }
    }
  }
}
