import {Injectable} from '@angular/core';
import {Plugins} from "@capacitor/core";
import {MatDialog} from "@angular/material/dialog";
import {DonateHintDialogComponent} from "./donate-hint-dialog/donate-hint-dialog.component";
import {monthsPastSince} from "@territory-offline-workspace/shared-utils";
const { Browser} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DonateHintService
{
  constructor(private dialog: MatDialog)
  {
  }

  public async forwardToDonate()
  {
    await Browser.open({url: 'https://www.buymeacoffee.com/territoryoff'});
  }

  public considerShowHintForDonate()
  {
    const lastHint = localStorage.getItem(DonateHintDialogComponent.LAST_HINT_KEY)

    if(!lastHint || monthsPastSince(lastHint) >= 3)
    {
      setTimeout(() => this.dialog.open(DonateHintDialogComponent, {
        width: "95vw",
        backdropClass: "donate-backdrop"
      }), 3500)
    }
  }
}
