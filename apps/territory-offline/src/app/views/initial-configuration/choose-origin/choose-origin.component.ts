import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {TerritoryMapsService} from "../../../core/services/territory/territory-maps.service";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {take, tap} from "rxjs/operators";
import {selectSettings} from "../../../core/store/settings/settings.selectors";
import {SettingsState} from "../../../core/store/settings/settings.reducer";
import {UpsertSettings, UpsertSettingsSuccess} from "../../../core/store/settings/settings.actions";
import {Actions, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";

@Component({
  selector: 'app-choose-origin',
  templateUrl: './choose-origin.component.html',
  styleUrls: ['./choose-origin.component.scss']
})
export class ChooseOriginComponent implements OnInit
{
  @HostBinding("class.app-choose-origin")
  public appChooseOriginClass = true;

  @Input()
  public initialConfiguration: boolean;

  @Output()
  public onChoose = new EventEmitter();

  constructor(private territoryMapsService: TerritoryMapsService,
              private actions$: Actions,
              private router: Router,
              private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    if (this.initialConfiguration)
    {
      this.territoryMapsService.initJustMap({
        containerName: "origin-map",
        initialZoom: 11,
        center: [10.860600, 48.355340]
      });
    }
    else
    {
      this.store.pipe(
        select(selectSettings),
        take(1),
        tap(settings => this.territoryMapsService.initJustMap({
          containerName: "origin-map",
          initialZoom: 11,
          center: [settings.territoryOrigin.lng, settings.territoryOrigin.lat]
        }))
      ).subscribe();
    }
  }

  public choose()
  {
    const center = this.territoryMapsService.getMap().getCenter();

    if (this.initialConfiguration)
    {
      this.onChoose.emit(center)
    }
    else
    {
      this.emitWhenUpdatedSettings();

      this.store.pipe(
        select(selectSettings),
        take(1),
        tap((settings: SettingsState) =>
          this.store.dispatch(UpsertSettings({
            settings: {
              ...settings,
              territoryOrigin: center
            }
          }))
        )
      ).subscribe();
    }
  }

  private emitWhenUpdatedSettings()
  {
    this.actions$
      .pipe(
        ofType(UpsertSettingsSuccess),
        take(1),
        tap(() => this.onChoose.emit())
      ).subscribe();

    if (!this.initialConfiguration)
    {
      this.router.navigate([{outlets: {'global': null}}]);
    }
  }
}
