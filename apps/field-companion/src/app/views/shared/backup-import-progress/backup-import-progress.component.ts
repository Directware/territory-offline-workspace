import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-backup-import-progress',
  templateUrl: './backup-import-progress.component.html',
  styleUrls: ['./backup-import-progress.component.scss']
})
export class BackupImportProgressComponent implements OnInit
{
  public messages = [];

  constructor(public dialogRef: MatDialogRef<BackupImportProgressComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any)
  {
  }

  public ngOnInit(): void
  {
    if (this.data && this.data.progressMsg)
    {
      this.data.progressMsg.subscribe((msg) => this.messages.push(msg));
    }
  }
}
