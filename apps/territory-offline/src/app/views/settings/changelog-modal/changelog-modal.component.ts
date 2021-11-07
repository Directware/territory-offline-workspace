import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Showdown from 'showdown/dist/showdown.min';

@Component({
  selector: 'app-changelog-modal',
  templateUrl: './changelog-modal.component.html',
  styleUrls: ['./changelog-modal.component.scss'],
})
export class ChangelogModalComponent implements OnInit {
  public changelogHtml: string;

  constructor(private http: HttpClient) {}

  public ngOnInit(): void {
    this.http
      .get('assets/CHANGELOG.md', { responseType: 'text' })
      .subscribe((resp) => this.convertMDText(resp));
  }

  private convertMDText(text) {
    const converter = new Showdown.Converter();
    this.changelogHtml = converter.makeHtml(text);
  }
}
