import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit
{
  @HostBinding("class.app-list-item")
  public appListItemClass = true;

  public constructor()
  {
  }

  public ngOnInit(): void
  {
  }
}
