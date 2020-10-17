import {Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ui-hideable-panel',
  templateUrl: './hideable-panel.component.html',
  styleUrls: ['./hideable-panel.component.scss']
})
export class HideablePanelComponent implements OnInit
{
  @Input()
  public header: string;

  @HostBinding("class.open")
  public isOpen: boolean;

  public show()
  {
    this.isOpen = true;
  }

  public hide()
  {
    this.isOpen = false;
  }

  public constructor()
  {
  }

  public ngOnInit(): void
  {
  }

  public toggle()
  {
    this.isOpen = !this.isOpen;
  }

  public close()
  {
    this.isOpen = false;
  }
}
