import {Injectable, NgZone} from '@angular/core';
import {Plugins} from "@capacitor/core";
import {TranslateService} from "@ngx-translate/core";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../store/index.reducers";
import {selectSettings} from "../store/settings/settings.selectors";
import {take} from "rxjs/operators";
import {Router} from "@angular/router";

const {LocalNotifications} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService
{
  private localStorageKey = "[LocalNotificationsService] last monthlyReportReminder"

  constructor(private translateService: TranslateService,
              private router: Router,
              private ngZone: NgZone,
              private store: Store<ApplicationState>)
  {
  }

  public async askForLocalNotifications()
  {
    return await LocalNotifications.requestPermission();
  }

  public async areLocalNotificationsEnabled()
  {
    const settings = await this.store.pipe(select(selectSettings), take(1)).toPromise();

    let result = null;

    try
    {
      result = await LocalNotifications.areEnabled();
    } catch (e)
    {
      console.warn(e);
    }

    return settings.monthlyReminder && !!result ? result.value : false;
  }

  public async handleMonthlyReminder()
  {
    const enabled = await this.areLocalNotificationsEnabled();

    if (enabled)
    {
      const now = new Date();
      let lastDayInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      if (now.getMonth() == 11)
      {
        lastDayInMonth = new Date(now.getFullYear() + 1, 0, 0);
      }

      lastDayInMonth.setHours(18);

      if(lastDayInMonth.getTime() < new Date().getTime())
      {
        return;
      }

      LocalNotifications.schedule({
        notifications: [
          {
            title: this.translateService.instant("localNotifications.monthlyReminderTitle"),
            body: this.translateService.instant("localNotifications.monthlyReminderBody"),
            id: 1,
            schedule: {at: lastDayInMonth},
            sound: null,
            attachments: null,
            actionTypeId: "monthlyReportReminder",
            extra: null
          }
        ]
      });

      LocalNotifications.addListener("localNotificationActionPerformed", (notificationAction) =>
      {
        if (notificationAction.notification.actionTypeId === "monthlyReportReminder")
        {
          this.ngZone.run(() => {
            setTimeout(() => this.router.navigate(["send-report"]), 500);
          })
        }
      });
    }
    else
    {
      const pendingNotifications = await LocalNotifications.getPending();
      if (pendingNotifications.notifications.length > 0)
      {
        await LocalNotifications.cancel(pendingNotifications);
      }
    }
  }
}
