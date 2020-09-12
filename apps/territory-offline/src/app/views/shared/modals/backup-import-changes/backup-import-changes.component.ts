import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../../../core/store/index.reducers";
import {DeleteTerritory} from "../../../../core/store/territories/territories.actions";
import {DeletePublisher} from "../../../../core/store/publishers/publishers.actions";
import {DeleteVisitBan} from "../../../../core/store/visit-bans/visit-bans.actions";
import {DeleteAssignment} from "../../../../core/store/assignments/assignments.actions";
import {DeleteTag} from "../../../../core/store/tags/tags.actions";
import {DeleteDrawing} from "../../../../core/store/drawings/drawings.actions";
import {
  Assignment,
  DatabaseEntity,
  Publisher,
  Tag,
  Territory,
  ToBackup,
  VisitBan
} from "@territory-offline-workspace/api";

@Component({
  selector: 'app-backup-import-changes',
  templateUrl: './backup-import-changes.component.html',
  styleUrls: ['./backup-import-changes.component.scss']
})
export class BackupImportChangesComponent implements OnInit
{
  public deletedItems = {};
  public keepItems = {};

  public showAllImportedTerritories: boolean;
  public showAllImportedPublisher: boolean;
  public showAllImportedVisitBans: boolean;
  public showAllImportedTags: boolean;
  public showAllImportedAssignments: boolean;

  public entityTypes = {
    territory: "[entityTypes] territory",
    publisher: "[entityTypes] publisher",
    tag: "[entityTypes] tag",
    visitBan: "[entityTypes] visitBan",
    assignment: "[entityTypes] assignment",
  };

  constructor(public dialogRef: MatDialogRef<BackupImportChangesComponent>,
              private store: Store<ApplicationState>,
              @Inject(MAT_DIALOG_DATA) public data: { toBeImported: ToBackup, potentiallyDeleted: ToBackup })
  {
  }

  public ngOnInit(): void
  {
  }

  public deleteItem(entity: DatabaseEntity, entityType: string)
  {
    const shouldDelete = confirm("Möchtest du es wirklich löschen?");

    if (shouldDelete)
    {
      this.deletedItems[entity.id] = true;

      switch (entityType)
      {
        case this.entityTypes.territory:
        {
          const territory = entity as Territory;
          this.store.dispatch(DeleteTerritory({territory: territory}));

          this.data.potentiallyDeleted.drawings
            .filter(d => d.id === territory.territoryDrawingId)
            .forEach(d => this.store.dispatch(DeleteDrawing({drawing: d})));
          break;
        }
        case this.entityTypes.publisher:
        {
          this.store.dispatch(DeletePublisher({publisher: entity as Publisher}));
          break;
        }
        case this.entityTypes.visitBan:
        {
          this.store.dispatch(DeleteVisitBan({visitBan: entity as VisitBan}));
          break;
        }
        case this.entityTypes.assignment:
        {
          this.store.dispatch(DeleteAssignment({
            assignment: entity as Assignment
          }));
          break;
        }
        case this.entityTypes.tag:
        {
          this.store.dispatch(DeleteTag({tag: entity as Tag}));
          break;
        }
      }
    }
  }

  public keepItem(entity: DatabaseEntity)
  {
    this.keepItems[entity.id] = true;
  }

  public done()
  {
    this.dialogRef.close();
  }
}
