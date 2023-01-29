import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { MatDialog } from "@angular/material/dialog";
import { DonateHintDialogComponent } from "./donate-hint-dialog/donate-hint-dialog.component";
import { monthsPastSince } from "@territory-offline-workspace/shared-utils";

import { Browser } from "@capacitor/browser";

@Injectable({
  providedIn: "root",
})
export class DonateHintService {
  private shouldNotShowDonationHint: boolean;

  constructor(private dialog: MatDialog) {}

  public async forwardToDonate() {
    await Browser.open({ url: "https://www.buymeacoffee.com/territoryoff" });
  }

  public blockDonationHint() {
    this.shouldNotShowDonationHint = true;
  }

  public considerShowHintForDonate() {
    if (this.shouldNotShowDonationHint) {
      return;
    }

    const lastHint = localStorage.getItem(
      DonateHintDialogComponent.LAST_HINT_KEY
    );

    if (!lastHint || monthsPastSince(lastHint) >= 3) {
      setTimeout(() => {
        if (this.shouldNotShowDonationHint) {
          return;
        }

        this.dialog.open(DonateHintDialogComponent, {
          panelClass: "feature-confirmation",
          backdropClass: "donate-backdrop",
        });
      }, 3500);
    }
  }
}
