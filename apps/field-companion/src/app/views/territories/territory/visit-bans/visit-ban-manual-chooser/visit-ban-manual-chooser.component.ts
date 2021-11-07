import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MapService } from '../../../../../core/services/map/map.service';
import { Observable } from 'rxjs';
import { TerritoryCard } from '@territory-offline-workspace/shared-interfaces';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'fc-visit-ban-manual-chooser',
  templateUrl: './visit-ban-manual-chooser.component.html',
  styleUrls: ['./visit-ban-manual-chooser.component.scss'],
})
export class VisitBanManualChooserComponent implements OnInit, AfterViewInit {
  public territoryCard$: Observable<TerritoryCard>;

  constructor(
    private mapService: MapService,
    private matDialogRef: MatDialogRef<VisitBanManualChooserComponent>,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {}

  public ngAfterViewInit() {
    this.mapService.initWithOneTerritory(this.activatedRoute.snapshot.params.id);
  }

  public set() {
    const center = this.mapService.getCenterPoint();
    this.matDialogRef.close(center);
  }
}
