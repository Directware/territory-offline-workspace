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
import {take, tap} from 'rxjs/operators';
import {DatabaseService} from "../../core/services/db/database.service";
import {IpcService} from "../../core/services/common/ipc.service";
import {MatDialog} from "@angular/material/dialog";
import {ChangelogModalComponent} from "./changelog-modal/changelog-modal.component";
import {ToUpdatesService} from "../../core/services/common/to-updates.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit
{
  public settings$: Observable<SettingsState>;
  public version: string = version;

  constructor(private router: Router,
              private database: DatabaseService,
              private dialog: MatDialog,
              private ipcService: IpcService,
              private toUpdatesService: ToUpdatesService,
              private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    this.settings$ = this.store.pipe(select(selectSettings));
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
      alert("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut oder gehe auf unsere Seite: https://territory-offline.com");
      return;
    }

    if (!releaseInfo.newReleaseExists)
    {
      alert("Du hast die neuste Version.");
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
    const reallyDelete = confirm("Möchtest du wirklich alles löschen?");

    if (reallyDelete)
    {
      this.database.clear().then((resp) =>
      {
        if (resp.result)
        {
          alert("Starte die App bitte neu.");
          this.ipcService.send("restartTerritoryOffline");
          setTimeout(() => window.location.href = "/", 500);
        }
      });
    }
  }

  public contact()
  {
    window.location.href = "mailto:info@territory-offline.com";
  }
}
