import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'ui-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent implements OnInit, AfterViewInit
{
  @Input()
  public vFormControl: FormControl;

  @ViewChild("dateInput", {static: true})
  public dateInput: ElementRef;

  public constructor()
  {
  }

  public ngOnInit(): void
  {
  }

  public ngAfterViewInit()
  {
    if(this.dateInput && this.dateInput.nativeElement)
    {
      this.dateInput.nativeElement.focus()
    }
  }

  public userInput(tmp)
  {
    this.vFormControl.patchValue(tmp.target.valueAsDate);
    this.vFormControl.markAsDirty();
  }
}
