import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../../core/store/index.reducers";
import {TranslateService} from "@ngx-translate/core";
import {DataExportService} from "../../../../core/services/data-export.service";
import {selectTerritoryCardById} from "../../../../core/store/territory-card/territory-card.selectors";
import {Observable} from "rxjs";
import {TerritoryCard} from "@territory-offline-workspace/api";
import {DeleteTerritoryCard} from "../../../../core/store/territory-card/territory-card.actions";

@Component({
  selector: 'fc-return-territory-card',
  templateUrl: './return-territory-card.component.html',
  styleUrls: ['./return-territory-card.component.scss']
})
export class ReturnTerritoryCardComponent implements OnInit
{
  public territoryCard$: Observable<TerritoryCard>;

  public hideMainNavigation = true;

  public constructor(private store: Store<ApplicationState>,
                     private router: Router,
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

  public async sendTerritoryCard()
  {
    const shouldGiveBack = confirm(this.translateService.instant("territories.giveBackConfirmation"));
    if (shouldGiveBack)
    {
      const territoryCard = await this.territoryCard$.pipe(first()).toPromise();
      await this.dataExportService.giveBackTerritory(territoryCard);
    }
  }

  public async deleteTerritoryCard()
  {
    const shouldDelete = confirm(this.translateService.instant("territories.deleteConfirmation"));
    if (shouldDelete)
    {
      const territoryCard = await this.territoryCard$.pipe(first()).toPromise();
      this.store.dispatch(DeleteTerritoryCard({territoryCard}));
      this.router.navigate(["/territories"]);
    }
  }
}
