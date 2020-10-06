import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {Observable} from "rxjs";
import {TerritoryCard} from "@territory-offline-workspace/api";
import {selectTerritoryCardById} from "../../../core/store/territory-card/territory-card.selectors";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {TranslateService} from "@ngx-translate/core";
import {first} from "rxjs/operators";
import {DataExportService} from "../../../core/services/data-export.service";

@Component({
  selector: 'fc-territory',
  templateUrl: './territory.component.html',
  styleUrls: ['./territory.component.scss']
})
export class TerritoryComponent implements OnInit
{
  public territoryCard$: Observable<TerritoryCard>;
  public hideMainNavigation = true;

  public constructor(private store: Store<ApplicationState>,
                     private translateService: TranslateService,
                     private dataExportService: DataExportService,
                     private activatedRoute: ActivatedRoute)
  {
  }

  public ngOnInit(): void
  {
    this.territoryCard$ = this.store.pipe(select(selectTerritoryCardById, this.activatedRoute.snapshot.params.id));
  }

  public done()
  {
    window.history.back();
  }

  public assignEndTime(territoryCard: TerritoryCard)
  {
    return moment(territoryCard.assignment.startTime).add(territoryCard.estimationInMonths, "M");
  }

  public async giveBack()
  {
    const shouldGiveBack = confirm(this.translateService.instant("territories.giveBackConfirmation"));
    if (shouldGiveBack)
    {
      const territoryCard = await this.territoryCard$.pipe(first()).toPromise();
      await this.dataExportService.giveBackTerritory(territoryCard);

      // TODO löschen / archivieren?
    }
  }
}
