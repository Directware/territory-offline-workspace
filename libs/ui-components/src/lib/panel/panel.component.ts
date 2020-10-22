import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit
{
  @HostBinding("class.app-panel")
  public appPanelClass = true;

  public constructor()
  {
  }

  public ngOnInit(): void
  {
  }
}
