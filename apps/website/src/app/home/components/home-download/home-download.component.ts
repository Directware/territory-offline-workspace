import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ReleaseInfo} from "../../../models/release-info.interface";
import {OsNames} from "../../../models/os-name.enum";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-home-download',
  templateUrl: './home-download.component.html',
  styleUrls: ['./home-download.component.scss']
})
export class HomeDownloadComponent implements OnInit {
  public osNames = OsNames;
  public os: string;
  public releaseInfo: ReleaseInfo;
  public errorGettingReleaseInfo;

  constructor(private httpClient: HttpClient) {
  }

  public ngOnInit() {
    this.os = this.getOS();
    this.getReleaseInfo();
  }

  private getReleaseInfo() {
    this.httpClient
      .get(`${environment.releasesHost}/current-release.json`)
      .subscribe(
        (resp: ReleaseInfo) => this.releaseInfo = resp,
        (error) => {
          console.warn(error);
          this.errorGettingReleaseInfo = error;
        });
  }

  private getOS() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = this.osNames.MACOS;
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = this.osNames.IOS;
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = this.osNames.WIN64;
    } else if (/Android/.test(userAgent)) {
      os = this.osNames.ANDROID;
    } else if (!os && /Linux/.test(platform)) {
      os = this.osNames.LINUX;
    }

    return os;
  }

  public download(os: string) {
    const a = document.createElement('a');
    switch (os) {
      case OsNames.MACOS: {
        a.href = `${environment.releasesHost}/${this.releaseInfo.macFileName}`;
        break;
      }
      case OsNames.WIN64: {
        a.href = `${environment.releasesHost}/${this.releaseInfo.winFileName}`;
        break;
      }
      case OsNames.LINUX: {
        a.href = `${environment.releasesHost}/${this.releaseInfo.linuxFileName}`;
        break;
      }
    }
    a.download = a.href.substr(a.href.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
