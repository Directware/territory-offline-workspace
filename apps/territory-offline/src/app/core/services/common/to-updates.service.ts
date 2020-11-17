import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, take, tap} from 'rxjs/operators';

import {version as currentVersion} from './../../../../../package.json';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {select, Store} from '@ngrx/store';
import {selectSettings} from '../../store/settings/settings.selectors';
import {UpsertSettings} from '../../store/settings/settings.actions';
import {ApplicationState} from '../../store/index.reducers';
import {OsNames, ReleaseInfo} from "@territory-offline-workspace/api";

@Injectable({
  providedIn: 'root'
})
export class ToUpdatesService
{
  constructor(private httpClient: HttpClient,
              private store: Store<ApplicationState>)
  {
    // const isNewer = this.isVersionAGreater("2.1.10", "2.1.9");
    // const isNewer = this.isVersionAGreater("2.1.9", "2.1.8");
    // const isNewer = this.isVersionAGreater("2.2.9", "2.1.10");
    // console.log("ToUpdatesService", isNewer);
  }

  public async considerToGetReleaseInfos(): Promise<{newReleaseExists: boolean, version: string, hasError: boolean}>
  {
    const releaseInfo = await this.getCurrentReleaseInfos()
      .pipe(
        take(1),
        map(resp => ({
            newReleaseExists: this.isVersionAGreater(resp.version, currentVersion),
            version: resp.version,
            currentOsDownloadUrl: resp.currentOsDownloadUrl,
            hasError: resp.hasError
          })
        )
      ).toPromise();

    this.updateStore(releaseInfo);
    return releaseInfo;
  }

  private getCurrentReleaseInfos(): Observable<ReleaseInfo>
  {
    return this.httpClient
      .get<ReleaseInfo>(`${environment.releasesHost}/current-release.json`)
      .pipe(
        map((resp) =>
        {
          switch (this.getOS())
          {
            case OsNames.MACOS:
              resp.currentOsDownloadUrl = `${environment.releasesHost}/${resp.macFileName}`;
              break;
            case OsNames.WIN64:
              resp.currentOsDownloadUrl = `${environment.releasesHost}/${resp.winFileName}`;
              break;
            case OsNames.LINUX:
              resp.currentOsDownloadUrl = `${environment.releasesHost}/${resp.linuxFileName}`;
              break;
          }

          return resp;
        }),
        catchError(error =>
        {
          console.warn(`Could not get current release info.`, error);
          return of({...error, hasError: true});
        })
      );
  }

  private isVersionAGreater(version_a, version_b)
  {
    if (!version_a || !version_b)
    {
      return false;
    }
    // compares version_a as it relates to version_b
    // a = b => "same"
    // a > b => "larger"
    // a < b => "smaller"
    // NaN   => "invalid"

    const arr_a = version_a.split('.');
    const arr_b = version_b.split('.');

    let result = 'same'; // initialize to same // loop tries to disprove

    // loop through a and check each number against the same position in b
    for (let i = 0; i < arr_a.length; i++)
    {
      let a = parseInt(arr_a[i], 10);
      let b = parseInt(arr_b[i], 10);

      // same up to this point so if a is not there, a is smaller
      if (typeof a === 'undefined')
      {
        result = 'smaller';
        break;

        // same up to this point so if b is not there, a is larger
      }
      else if (typeof b === 'undefined')
      {
        result = 'larger';
        break;

        // otherwise, compare the two numbers
      }
      else
      {
        // non-positive numbers are invalid
        if (a >= 0 && b >= 0)
        {
          if (a < b)
          {
            result = 'smaller';
            break;
          }
          else if (a > b)
          {
            result = 'larger';
            break;
          }
        }
        else
        {
          result = 'invalid';
          break;
        }
      }
    }

    // account for the case where the loop ended but there was still a position in b to evaluate
    if (result === 'same' && arr_b.length > arr_a.length)
    {
      result = 'smaller';
    }

    switch (result)
    {
      case "larger":
        return true;
      default:
        return false;
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

  private updateStore(releaseInfo)
  {
    console.log("ja?");
    this.store.pipe(
      select(selectSettings),
      take(1),
      tap((settings) =>
      {
        this.store.dispatch(UpsertSettings({
          settings: {
            ...settings,
            releaseInfo: releaseInfo
          }
        }));
      })
    ).subscribe();
  }
}
