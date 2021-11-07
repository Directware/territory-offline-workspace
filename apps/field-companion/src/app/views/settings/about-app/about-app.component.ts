import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { FIELD_COMPANION_VERSION } from '../../../app.version';

const { Share } = Plugins;

@Component({
  selector: 'app-about-app',
  templateUrl: './about-app.component.html',
  styleUrls: ['./about-app.component.scss'],
})
export class AboutAppComponent implements OnInit {
  public hideMainNavigation = true;
  public version: string;
  public currentYear = new Date().getFullYear();

  constructor() {}

  public ngOnInit(): void {
    this.version = FIELD_COMPANION_VERSION;
  }

  public done() {
    window.history.back();
  }

  public shareApp() {
    Share.share({
      dialogTitle: 'Field Companion',
      title: 'Field Companion',
      text: 'https://apps.apple.com/de/app/field-companion/id1513900519',
    });
  }
}
