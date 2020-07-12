import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-second-thread-header',
  templateUrl: './second-thread-header.component.html',
  styleUrls: ['./second-thread-header.component.scss']
})
export class SecondThreadHeaderComponent implements OnInit
{
  @Input()
  public valid: boolean;

  @Input()
  public readonly: boolean;

  @Input()
  public positiveActionName: string;

  @Input()
  public specific: boolean;

  @Output()
  public onCancel = new EventEmitter();

  @Output()
  public onSave = new EventEmitter();

  @Output()
  public onEdit = new EventEmitter();

  @Output()
  public onBack = new EventEmitter();

  constructor()
  {
  }

  public ngOnInit(): void
  {
  }

  public cancel()
  {
    this.onCancel.emit();
  }

  public save()
  {
    if (this.valid)
    {
      this.onSave.emit();
    }
  }

  public back()
  {
    this.onBack.emit();
  }

  public edit()
  {
    this.onEdit.emit();
  }
}
