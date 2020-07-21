import {Injectable} from '@angular/core';
import {take, tap} from "rxjs/operators";
import {select, Store} from "@ngrx/store";
import {selectConfirmedFeatures} from "../store/settings/settings.selectors";
import {ReportUpToTheMinuteComponent} from "../../views/feature-confirmation-modals/report-up-to-the-minute/report-up-to-the-minute.component";
import {ApplicationState} from "../store/index.reducers";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class FeatureConfirmationService
{
  constructor(private store: Store<ApplicationState>,
              private matDialog: MatDialog)
  {
  }

  public check()
  {
    this.store.pipe(
      take(1),
      select(selectConfirmedFeatures),
      tap(confirmedFeatures =>
      {
        if (!confirmedFeatures || !confirmedFeatures["report.up.to.the.minute"])
        {
          this.matDialog.open(ReportUpToTheMinuteComponent, {
            panelClass: "feature-confirmation",
            disableClose: true
          });
          return;
        }
      })
    ).subscribe();
  }
}
