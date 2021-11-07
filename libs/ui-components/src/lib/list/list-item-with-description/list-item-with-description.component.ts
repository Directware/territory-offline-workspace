import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-item-with-description',
  templateUrl: './list-item-with-description.component.html',
  styleUrls: ['./list-item-with-description.component.scss'],
})
export class ListItemWithDescriptionComponent implements OnInit {
  @HostBinding('class.app-list-item')
  public appListItemClass = true;

  public constructor() {}

  public ngOnInit(): void {}
}
