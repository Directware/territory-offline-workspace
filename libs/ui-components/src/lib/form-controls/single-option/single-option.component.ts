import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {v4 as uuid} from 'uuid';
import {FormControl} from '@angular/forms';
import {IosSelector} from "../common/ios-date-selector.class";
import {IosSelectorOptionSource} from "../model/ios-selector-option-source.interface";

@Component({
  selector: 'ui-single-option',
  templateUrl: './single-option.component.html',
  styleUrls: ['./single-option.component.scss']
})
export class SingleOptionComponent implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  public vFormControl: FormControl;

  @Input()
  public optionSource: IosSelectorOptionSource[];

  @Input()
  public type: string; // infinite || normal

  public optionElementId = btoa(uuid());
  public optionSelector: IosSelector;

  constructor()
  {
  }

  public ngOnInit(): void
  {
  }

  public ngAfterViewInit(): void
  {
    this.optionSelector = new IosSelector({
      el: `#${this.optionElementId}`,
      type: this.type || 'infinite',
      source: this.optionSource,
      count: this.optionSource.length,
      initialValue: this.optionSource.filter(o => o.value === this.vFormControl.value)[0] || this.optionSource[0],
      onChange: (selected: {text: string, value: any}) =>
      {
        this.vFormControl.setValue(selected.value);
        this.vFormControl.markAsDirty();
      }
    });
  }

  public ngOnDestroy(): void
  {
    this.optionSelector.destroy();
  }
}
