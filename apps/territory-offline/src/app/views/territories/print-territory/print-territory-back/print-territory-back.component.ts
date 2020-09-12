import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../../core/store/index.reducers";
import {Observable} from "rxjs";
import {selectVisitBansByTerritoryId} from "../../../../core/store/visit-bans/visit-bans.selectors";
import {filter, map} from "rxjs/operators";
import {Territory, TerritoryCardFormat, VisitBan} from "@territory-offline-workspace/api";

@Component({
  selector: 'app-print-territory-back',
  templateUrl: './print-territory-back.component.html',
  styleUrls: ['./print-territory-back.component.scss']
})
export class PrintTerritoryBackComponent implements OnInit
{
  public territory: Territory;
  public showComment: boolean;
  public showBleedingEdges: boolean;
  public showBoundaryNames: boolean;
  public cardHeight: string;
  public relevantAddresses$: Observable<VisitBan[]>;

  public backCards$: Observable<VisitBan[][]>;

  constructor(private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
  }

  public refreshStats(tcf: TerritoryCardFormat, printedMapConfiguration)
  {
    this.showComment = printedMapConfiguration.showComment;
    this.showBoundaryNames = printedMapConfiguration.showBoundaryNames;
    this.showBleedingEdges = printedMapConfiguration.bleedEdges;
    this.cardHeight = tcf.dimensions.h + tcf.dimensions.dim;

    this.backCards$ = this.store.pipe(
      select(selectVisitBansByTerritoryId, this.territory.id),
      filter(vb => !!vb),
      map((visitBans: VisitBan[]) =>
      {
        const maxCountPerCard = printedMapConfiguration.showComment ? tcf.visitBansRows.withComment : tcf.visitBansRows.blank;
        const cards = [[]];

        let i = 0;
        let cardIndex = 0;
        visitBans.forEach(vb =>
        {
          if (i <= maxCountPerCard)
          {
            cards[cardIndex].push(vb);
            i++;
          }
          else
          {
            i = 0;
            cardIndex++;
            cards[cardIndex] = [];
            cards[cardIndex].push(vb);
          }
        });
        cards[cardIndex] = this.visitBansPadding(cards[cardIndex], maxCountPerCard);
        return cards;
      })
    );
  }

  public boundaryNamesWithPadding()
  {
    const paddedBoundaryNames = [];
    let paddingMaxLength = 0;
    if(!!this.territory.boundaryNames)
    {
      paddedBoundaryNames.push(...this.territory.boundaryNames)
      paddingMaxLength = this.territory.boundaryNames.length;
    }

    for (let i = 0; i < (12 - paddingMaxLength); i++)
    {
      paddedBoundaryNames.push(null);
    }

    return paddedBoundaryNames;
  }

  private visitBansPadding(visitBans: VisitBan[], maxCount: number)
  {
    const paddedAddresses = [...visitBans];
    const existingElementCount = visitBans.length;
    const paddingValue = maxCount;
    for (let i = 0; i <= (paddingValue - existingElementCount); i++)
    {
      paddedAddresses.push(null);
    }
    return paddedAddresses;
  }
}
