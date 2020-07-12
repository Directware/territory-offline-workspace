import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-circle-progress',
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.scss']
})
export class CircleProgressComponent implements OnInit
{
  @ViewChild("progressValue", {static: false})
  public progressValue: ElementRef;

  @Input()
  public radius: number;

  @Input()
  public progress: number;

  @Input()
  public hours: number;

  @Input()
  public minutes: number;

  @Input()
  public startColor;

  @Input()
  public stopColor;

  public CIRCUMFERENCE;

  constructor()
  {
  }

  public ngOnInit(): void
  {
    this.CIRCUMFERENCE = 2 * Math.PI * this.radius;
  }

  public calculateStrokeDashoffset()
  {
    if (this.progress >= 100)
    {
      return 1;
    }

    return (this.CIRCUMFERENCE * (1 - (this.progress / 100)));
  }

  public padTimeNumber(value: number): string
  {
    if (!value)
    {
      return "00";
    }
    return `${value}`.padStart(2, "0");
  }
}
