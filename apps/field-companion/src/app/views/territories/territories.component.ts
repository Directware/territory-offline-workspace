import {Component, OnInit} from '@angular/core';
import * as Pako from 'pako';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../core/store/index.reducers";
import {selectAllTerritoryCards} from "../../core/store/territory-card/territory-card.selectors";
import {Observable} from "rxjs";
import {TerritoryCard} from "@territory-offline-workspace/api";
import {UpsertTerritoryCard} from "../../core/store/territory-card/territory-card.actions";

@Component({
  selector: 'fc-territories',
  templateUrl: './territories.component.html',
  styleUrls: ['./territories.component.scss']
})
export class TerritoriesComponent implements OnInit
{
  public isMenuOpened: boolean;
  public territoryCards$: Observable<TerritoryCard[]>

  constructor(private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    this.territoryCards$ = this.store.pipe(select(selectAllTerritoryCards));
  }

  public openTerritoryFile(event)
  {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length)
    {
      const [file] = event.target.files;
      reader.onload = () => this.importTerritory(reader.result as any);
      reader.readAsArrayBuffer(file);
    }
  }

  private importTerritory(data)
  {
    const unzippedData = Pako.inflate(new Uint8Array(data), {to: 'string'});
    if (unzippedData)
    {
      const parsedData = JSON.parse(unzippedData);
      this.store.dispatch(UpsertTerritoryCard({territoryCard: parsedData}));
    }
  }
}
