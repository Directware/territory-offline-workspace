import {TranslateService} from '@ngx-translate/core';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
// @ts-ignore
import {version} from './../../../../package.json';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {Observable} from 'rxjs';
import {SettingsState} from '../../core/store/settings/settings.reducer';
import {selectSettings} from '../../core/store/settings/settings.selectors';
import {LockApp, UpsertSettings} from '../../core/store/settings/settings.actions';
import {first, take, tap} from 'rxjs/operators';
import {DatabaseService} from "../../core/services/db/database.service";
import {IpcService} from "../../core/services/common/ipc.service";
import {MatDialog} from "@angular/material/dialog";
import {ChangelogModalComponent} from "./changelog-modal/changelog-modal.component";
import {ToUpdatesService} from "../../core/services/common/to-updates.service";
import {ToLanguage} from "@territory-offline-workspace/ui-components";
import {AVAILABLE_LANGUAGES} from "../../core/i18n/all.i18n";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit
{
  public settings$: Observable<SettingsState>;
  public version: string = version;
  public initialLangList: string[];

  constructor(private router: Router,
              private database: DatabaseService,
              private dialog: MatDialog,
              private translateService: TranslateService,
              private ipcService: IpcService,
              private toUpdatesService: ToUpdatesService,
              private store: Store<ApplicationState>,
              private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
    this.settings$ = this.store.pipe(select(selectSettings));
    this.initialLangList = AVAILABLE_LANGUAGES.map(lang => lang.key);
    this.router.navigate([{outlets: {'second-thread': null}}]);
  }

  public lockApp()
  {
    this.store.dispatch(LockApp());
  }

  public navigateInSecondThread(path: string)
  {
    this.router.navigate([{outlets: {'second-thread': path}}]);
  }

  public navigateInGlobalThread(path: string)
  {
    this.router.navigate([{outlets: {'global': path}}]);
  }

  public async checkUpdates()
  {
    const releaseInfo = await this.toUpdatesService.considerToGetReleaseInfos();

    if (releaseInfo.hasError)
    {
      this.translate.get('settings.errorOccured').pipe(take(1)).subscribe((translation: string) => alert(translation))
      return;
    }

    if (!releaseInfo.newReleaseExists)
    {
      this.translate.get("settings.alreadyLatestVersion").pipe(take(1)).subscribe((translation: string) => alert(translation))
    }
  }

  public async chooseLanguage(event: ToLanguage)
  {
    if (this.translateService.getLangs().includes(event.languageCode))
    {
      const settings = await this.settings$.pipe(first()).toPromise();

      this.store.dispatch(UpsertSettings({
        settings: {
          ...settings,
          appLanguage: event
        }
      }));
      this.translateService.use(event.languageCode);
    }
  }

  public downloadNewRelease(release)
  {
    this.ipcService.send('downloadNewAppVersion', {...release});
    this.store.pipe(
      select(selectSettings),
      take(1),
      tap((settings) =>
      {
        this.store.dispatch(UpsertSettings({
          settings: {
            ...settings,
            releaseInfo: null
          }
        }));
      })
    ).subscribe();
  }

  public openChangelogDialog()
  {
    this.dialog.open(ChangelogModalComponent, {maxWidth: "50vw", maxHeight: "50vh"});
  }

  public clearAllAppData()
  {
    this.translate.get(['settings.reallyReset', 'settings.restartApp']).pipe(take(1)).subscribe((translations: { [key: string]: string }) =>
    {
      const reallyDelete = confirm(translations['settings.reallyReset']);

      if (reallyDelete)
      {
        this.database.clear().then((resp) =>
        {
          if (resp.result)
          {
            alert(translations['settings.restartApp']);
            this.ipcService.send("restartTerritoryOffline");
            setTimeout(() => window.location.href = "/", 500);
          }
        });
      }
    })
  }

  public contact()
  {
    window.location.href = "mailto:info@territory-offline.com";
  }
}
