import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { LocalNotificationsService } from "./core/services/local-notifications.service";
import { ApplicationState } from "./core/store/index.reducers";
import { selectInitialConfigurationDone } from "./core/store/settings/settings.selectors";
import { slideInAnimation } from "./route-animation";

@Component({
  selector: "territory-offline-workspace-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
  public hideMainNavigation: boolean;
  public isAlreadyConfigured$: Observable<boolean>;

  constructor(
    private store: Store<ApplicationState>,
    private localNotificationsService: LocalNotificationsService
  ) {}

  public ngOnInit(): void {
    this.isAlreadyConfigured$ = this.store.pipe(
      select(selectInitialConfigurationDone)
    );
    this.localNotificationsService.handleMonthlyReminder();
  }

  public activateRouterOutlet(e) {
    this.hideMainNavigation = e.hideMainNavigation;
  }
}
