import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {v4 as uuid} from 'uuid';
import {FormControl} from '@angular/forms';
import {IosSelector} from "../common/ios-date-selector.class";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  public vFormControl: FormControl;

  public yearElementId = btoa(uuid());
  public yearSelector: IosSelector;

  public monthElementId = btoa(uuid());
  public monthSelector: IosSelector;

  public dayElementId = btoa(uuid());
  public daySelector: IosSelector;

  private isInitialising = true;
  private months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  constructor()
  {
  }

  public ngOnInit(): void
  {
    if(!this.vFormControl)
    {
      console.warn("[DatePickerComponent] please input a form control!")
    }
  }

  public ngAfterViewInit(): void
  {
    const initialValueDate = this.vFormControl.value as Date;
    let currentYear = new Date().getFullYear();
    let currentMonth = 1;
    let currentDay = 1;

    const yearSource = this.getYears();
    const monthSource = this.getMonths();
    let daySource = this.getDays(currentYear, currentMonth);

    this.yearSelector = new IosSelector({
      el: `#${this.yearElementId}`,
      type: 'infinite',
      source: yearSource,
      count: 20,
      initialValue: {value: initialValueDate ? initialValueDate.getFullYear() : null},
      onChange: selected =>
      {
        currentYear = selected.value;
        daySource = this.getDays(currentYear, currentMonth);
        this.daySelector.updateSource(daySource);
        this.setNewDateValue(this.yearSelector.value, this.monthSelector.value, this.daySelector.value);
      }
    });

    this.monthSelector = new IosSelector({
      el: `#${this.monthElementId}`,
      type: 'infinite',
      source: monthSource,
      count: 20,
      initialValue: {value: initialValueDate ? initialValueDate.getMonth() : null},
      onChange: selected =>
      {
        currentMonth = selected.value;
        daySource = this.getDays(currentYear, currentMonth);
        this.daySelector.updateSource(daySource);
        this.setNewDateValue(this.yearSelector.value, this.monthSelector.value, this.daySelector.value);
      }
    });

    this.daySelector = new IosSelector({
      el: `#${this.dayElementId}`,
      type: 'infinite',
      source: [],
      count: 20,
      initialValue: {value: initialValueDate ? initialValueDate.getDate() : null},
      onChange: selected =>
      {
        currentDay = selected.value;
        this.setNewDateValue(this.yearSelector.value, this.monthSelector.value, this.daySelector.value);
      }
    });

    setTimeout(() => this.setInitialValue(), 0);
  }

  public ngOnDestroy(): void
  {
    this.yearSelector.destroy();
    this.monthSelector.destroy();
    this.daySelector.destroy();
  }

  private getYears()
  {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear - 20; i < currentYear + 20; i++)
    {
      years.push({
        value: i,
        text: i // Das Jahr
      });
    }
    return years;
  }

  private getMonths()
  {
    const months = [];
    for (let i = 0; i <= 12; i++)
    {
      months.push({
        value: i,
        text: this.months[i]
      });
    }
    return months;
  }

  private getDays(year, month)
  {
    const dayCount = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = 1; i <= dayCount; i++)
    {
      days.push({
        value: i,
        text: i
      });
    }

    return days;
  }

  private setNewDateValue(year: number, month: number, day: number)
  {
    if (!this.isInitialising)
    {
      const newDateValue = new Date(year, month, day);
      this.vFormControl.setValue(newDateValue);
      this.vFormControl.markAsDirty();
    }
  }

  private setInitialValue()
  {
    let initialDate = this.vFormControl.value;

    if(!initialDate)
    {
      initialDate = new Date();
    }

    this.yearSelector.select(initialDate.getFullYear());
    this.monthSelector.select(initialDate.getMonth());
    this.daySelector.select(initialDate.getDate());
    setTimeout(() => this.isInitialising = false, 0);
  }
}
