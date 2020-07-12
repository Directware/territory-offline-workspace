import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {Observable} from "rxjs";
import {VisitBan} from "../../../core/store/visit-bans/model/visit-ban.model";
import {selectAllVisitBans} from "../../../core/store/visit-bans/visit-bans.selectors";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-whole-visit-bans',
  templateUrl: './whole-visit-bans.component.html',
  styleUrls: ['./whole-visit-bans.component.scss']
})
export class WholeVisitBansComponent implements OnInit
{
  public search: { value: string };
  public currentVisitBanId: string;
  public visitBans$: Observable<VisitBan[]>;
  public sort: string = "alphabetic";
  public sortFunction: Function;

  constructor(private store: Store<ApplicationState>, private router: Router)
  {
  }

  public ngOnInit(): void
  {
    this.considerSortFunction(this.sort);
  }

  public createVisitBan()
  {
    this.router.navigate([{outlets: {'second-thread': ['visit-ban']}}]);
  }

  public editVisitBan(vb)
  {
    this.router.navigate([{outlets: {'second-thread': ['visit-ban', vb.territoryId, vb.id]}}]);
  }

  public changeSorting(sort)
  {
    this.sort = sort;
    this.considerSortFunction(this.sort);
  }

  private considerSortFunction(sort: string)
  {
    this.sortFunction = sort === "alphabetic" ? this.sortAlphabetical : this.sortLastVisit;

    this.visitBans$ = null;
    this.visitBans$ = this.store.pipe(
      select(selectAllVisitBans),
      map(visitBans => visitBans.sort((vb1, vb2) => this.sortFunction(vb1, vb2))),
      map(visitBans => [...visitBans])
    );
  }

  private sortAlphabetical(vb1: VisitBan, vb2: VisitBan)
  {
    return vb1.street < vb2.street ? -1 : 1;
  }

  private sortLastVisit(vb1: VisitBan, vb2: VisitBan)
  {
    const firstDate = vb1.lastVisit ? vb1.lastVisit : vb1.creationTime;
    const secondDate = vb2.lastVisit ? vb2.lastVisit : vb2.creationTime;

    return firstDate < secondDate ? -1 : 1;
  }
}
