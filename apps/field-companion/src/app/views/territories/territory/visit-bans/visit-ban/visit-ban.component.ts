import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {TerritoryCard} from "@territory-offline-workspace/api";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../../../core/store/index.reducers";
import {selectTerritoryCardById} from "../../../../../core/store/territory-card/territory-card.selectors";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {tap} from "rxjs/operators";
import {uuid4} from "@capacitor/core/dist/esm/util";

@Component({
  selector: 'fc-visit-ban',
  templateUrl: './visit-ban.component.html',
  styleUrls: ['./visit-ban.component.scss']
})
export class VisitBanComponent implements OnInit
{
  public territoryCard$: Observable<TerritoryCard>;
  public visitBanId: string;
  public formGroup: FormGroup;
  public hideMainNavigation = true;

  public constructor(private store: Store<ApplicationState>,
                     private fb: FormBuilder,
                     private activatedRoute: ActivatedRoute)
  {
  }

  public ngOnInit(): void
  {
    this.visitBanId = this.activatedRoute.snapshot.params.visitBanId;
    this.territoryCard$ = this.store.pipe(select(selectTerritoryCardById, this.activatedRoute.snapshot.params.id), tap((territoryCard) => this.initFormGroup(territoryCard)));
  }

  public done()
  {
    window.history.back();
  }

  public save(territoryCard: TerritoryCard)
  {
    if (this.formGroup.valid)
    {
      const rawValue = this.formGroup.getRawValue();
      const name = rawValue.name;

      const addressSegments = rawValue.address.split(" ");
      const streetSuffix = addressSegments[addressSegments.length];
      const street = addressSegments.pop().join();

      if (this.visitBanId)
      {
        const visitBan = territoryCard.visitBans.find(vb => vb.id === this.visitBanId);
        visitBan.name = name;
        visitBan.streetSuffix = streetSuffix;
        visitBan.street = street;
      }
      else
      {
        territoryCard.visitBans.push({
          id: uuid4(),
          name: name,
          street: street,
          streetSuffix: streetSuffix,
          creationTime: new Date(),
          gpsPosition: null,
          city: null,
          territoryId: territoryCard.territory.id,
          tags: []
        });
      }
    }
  }

  private initFormGroup(territoryCard: TerritoryCard)
  {
    const visitBan = territoryCard.visitBans.find(vb => vb.id === this.visitBanId);
    this.formGroup = this.fb.group({
      name: [visitBan ? visitBan.name : ""],
      address: [visitBan ? visitBan.street + " " + visitBan.streetSuffix : "", Validators.required],
    });
  }
}
