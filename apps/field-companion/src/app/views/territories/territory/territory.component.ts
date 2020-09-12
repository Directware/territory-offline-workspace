import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {Observable} from "rxjs";
import {TerritoryCard} from "@territory-offline-workspace/api";
import {selectTerritoryCardById} from "../../../core/store/territory-card/territory-card.selectors";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";

@Component({
  selector: 'fc-territory',
  templateUrl: './territory.component.html',
  styleUrls: ['./territory.component.scss']
})
export class TerritoryComponent implements OnInit
{
  public territoryCard$: Observable<TerritoryCard>;
  public hideMainNavigation = true;

  public constructor(private store: Store<ApplicationState>, private activatedRoute: ActivatedRoute)
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
}
