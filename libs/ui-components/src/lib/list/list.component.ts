import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @HostBinding('class.app-list')
  public appListClass = true;

  public constructor() {}

  public ngOnInit(): void {}
}
