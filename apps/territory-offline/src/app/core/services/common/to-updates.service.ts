import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {version as currentVersion} from './../../../../../package.json';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {OsNames, ReleaseInfo} from "@territory-offline-workspace/shared-interfaces";
import {compareVersions} from "@territory-offline-workspace/shared-utils";

@Injectable({
  providedIn: 'root'
})
export class ToUpdatesService
{
  private releaseInfo: ReleaseInfo;

  constructor(private httpClient: HttpClient)
  {
  }

  public getReleaseInfo(): Observable<ReleaseInfo>
  {
    if (!this.releaseInfo)
    {
      return this.getReleaseInfoFromServer()
        .pipe(
          map(ri => this.enrichReleaseInfo(ri)),
          tap(ri => this.releaseInfo = ri)
        );
    }

    return of(this.releaseInfo);
  }

  private getReleaseInfoFromServer(): Observable<ReleaseInfo>
  {
    return this.httpClient
      .get<ReleaseInfo>(`${environment.releasesHost}/current-release.json`)
      .pipe(
        catchError(error =>
        {
          console.warn(`Could not get current release info.`, error);
          return of({...error, hasError: true});
        })
      );
  }

  private enrichReleaseInfo(releaseInfo: ReleaseInfo): ReleaseInfo
  {
    let currentOsDownloadUrl;
    switch (this.getOS())
    {
      case OsNames.MACOS:
        currentOsDownloadUrl = `${environment.releasesHost}/${releaseInfo.macFileName}`;
        break;
      case OsNames.WIN64:
        currentOsDownloadUrl = `${environment.releasesHost}/${releaseInfo.winFileName}`;
        break;
      case OsNames.LINUX:
        currentOsDownloadUrl = `${environment.releasesHost}/${releaseInfo.linuxFileName}`;
        break;
    }

    return {
      ...releaseInfo,
      shouldUpdate: compareVersions(releaseInfo.version, currentVersion),
      currentOsDownloadUrl
    }
  }

  private getOS(): OsNames
  {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    // const platform = "Win64";
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;

    if (macosPlatforms.indexOf(platform) !== -1)
    {
      os = OsNames.MACOS;
    }
    else if (iosPlatforms.indexOf(platform) !== -1)
    {
      os = OsNames.IOS;
    }
    else if (windowsPlatforms.indexOf(platform) !== -1)
    {
      os = OsNames.WIN64;
    }
    else if (/Android/.test(userAgent))
    {
      os = OsNames.ANDROID;
    }
    else if (!os && /Linux/.test(platform))
    {
      os = OsNames.LINUX;
    }

    return os;
  }
}
