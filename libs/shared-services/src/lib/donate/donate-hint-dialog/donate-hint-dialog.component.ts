import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'territory-offline-workspace-donate-hint-dialog',
  templateUrl: './donate-hint-dialog.component.html',
  styleUrls: ['./donate-hint-dialog.component.scss'],
})
export class DonateHintDialogComponent implements OnInit {
  public static readonly LAST_HINT_KEY = '[DonateHintService] last hint';

  constructor(private dialogRef: MatDialogRef<DonateHintDialogComponent>) {}

  public ngOnInit(): void {
    localStorage.setItem(DonateHintDialogComponent.LAST_HINT_KEY, new Date().toISOString());
  }

  public close() {
    this.dialogRef.close();
  }
}
