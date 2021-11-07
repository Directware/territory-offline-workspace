import { Component, OnInit } from '@angular/core';
import { Feature } from '../../../models/feature.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public features: Feature[];

  constructor() {}

  ngOnInit() {
    this.features = Array(6)
      .fill(null)
      .map(
        (entry, index: number) =>
          new Feature(`home.feature${index + 1}.title`, `home.feature${index + 1}.text`)
      );
  }
}
