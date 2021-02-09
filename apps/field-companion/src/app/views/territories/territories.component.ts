import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../core/store/index.reducers";
import {
  selectAllExpiredTerritoryCards,
  selectAllNotExpiredTerritoryCards
} from "../../core/store/territory-card/territory-card.selectors";
import {Observable} from "rxjs";
import {TerritoryCard} from "@territory-offline-workspace/api";
import {TranslateService} from "@ngx-translate/core";
import {Plugins} from '@capacitor/core';
import {TerritoryCardService} from "../../core/services/territory-card.service";

const {FileSelector, Device} = Plugins;

@Component({
  selector: 'fc-territories',
  templateUrl: './territories.component.html',
  styleUrls: ['./territories.component.scss']
})
export class TerritoriesComponent implements OnInit
{
  @ViewChild("htmlInputElement", {static: false})
  public htmlInputElement: ElementRef;

  public isMenuOpened: boolean;
  public territoryCards$: Observable<TerritoryCard[]>
  public expiredTerritoryCards$: Observable<TerritoryCard[]>

  constructor(private store: Store<ApplicationState>,
              private territoryCardService: TerritoryCardService,
              private translateService: TranslateService)
  {
  }

  public ngOnInit(): void
  {
    this.territoryCards$ = this.store.pipe(select(selectAllNotExpiredTerritoryCards));
    this.expiredTerritoryCards$ = this.store.pipe(select(selectAllExpiredTerritoryCards));
  }

  public async openFileConsideringPlatform()
  {
    const deviceInfo = await Device.getInfo();

    switch (deviceInfo.platform)
    {
      case "ios":
      {
        this.select();
        break;
      }
      case "android":
      {
        this.select();
        break;
      }
      default:
      {
        console.log(this.htmlInputElement);
        this.htmlInputElement.nativeElement.click();
      }
    }
  }

  public async select()
  {
    const selectedFile = await FileSelector.fileSelector({
      multiple_selection: false,
      ext: ["*"]
    });

    const deviceInfo = await Device.getInfo();
    let paths;

    if (deviceInfo.platform === "ios")
    {
      paths = selectedFile.paths;
    }
    else if (deviceInfo.platform === "android")
    {
      paths = JSON.parse(selectedFile.paths)
    }

    if (selectedFile.extensions.includes("territory"))
    {
      const file = await fetch(paths[0]).then((r) => r.blob());
      this.readFile(file);
    }
    else
    {
      alert(this.translateService.instant("territories.wrongFileType"));
    }
  }

  public openTerritoryCardFromWeb(e)
  {
    this.readFile(this.htmlInputElement.nativeElement.files[0])
  }

  public readFile(file)
  {
    const reader = new FileReader();
    reader.onload = () => this.territoryCardService.importTerritory(reader.result as any);
    reader.readAsArrayBuffer(file);
  }
}
