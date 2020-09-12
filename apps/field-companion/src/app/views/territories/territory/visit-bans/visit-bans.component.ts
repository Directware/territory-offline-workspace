import {Component, Input, OnInit} from '@angular/core';
import {TerritoryCard} from "@territory-offline-workspace/api";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../../../core/store/index.reducers";

@Component({
  selector: 'fc-visit-bans',
  templateUrl: './visit-bans.component.html',
  styleUrls: ['./visit-bans.component.scss']
})
export class VisitBansComponent implements OnInit
{
  @Input()
  public territoryCard: TerritoryCard;

  public constructor(private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
  }

}
