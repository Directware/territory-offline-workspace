import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-block',
  templateUrl: './info-block.component.html',
  styleUrls: ['./info-block.component.scss'],
})
export class InfoBlockComponent implements OnInit {
  @Input()
  public image: string;

  @Input()
  public title: string;

  @Input()
  public description: string;

  constructor() {}

  public ngOnInit(): void {}
}
