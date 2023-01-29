import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { select, Store } from "@ngrx/store";
import { ApplicationState } from "../../core/store/index.reducers";
import {
  selectAllExpiredTerritoryCards,
  selectAllNotExpiredTerritoryCards,
} from "../../core/store/territory-card/territory-card.selectors";
import { combineLatest, Observable } from "rxjs";
import { TerritoryCard } from "@territory-offline-workspace/shared-interfaces";
import { TranslateService } from "@ngx-translate/core";
import { TerritoryCardService } from "../../core/services/territory-card.service";
import { map } from "rxjs/operators";

import { Device } from "@capacitor/device";
import { FilePicker } from "@capawesome/capacitor-file-picker";

@Component({
  selector: "fc-territories",
  templateUrl: "./territories.component.html",
  styleUrls: ["./territories.component.scss"],
})
export class TerritoriesComponent implements OnInit {
  @ViewChild("htmlInputElement", { static: false })
  public htmlInputElement: ElementRef;

  public isMenuOpened: boolean;
  public allTerritoryCards$: Observable<TerritoryCard[]>;
  public territoryCards$: Observable<TerritoryCard[]>;
  public expiredTerritoryCards$: Observable<TerritoryCard[]>;

  constructor(
    private store: Store<ApplicationState>,
    private territoryCardService: TerritoryCardService,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.territoryCards$ = this.store.pipe(
      select(selectAllNotExpiredTerritoryCards)
    );
    this.expiredTerritoryCards$ = this.store.pipe(
      select(selectAllExpiredTerritoryCards)
    );

    this.allTerritoryCards$ = combineLatest([
      this.territoryCards$,
      this.expiredTerritoryCards$,
    ]).pipe(map(([cards, expiredCards]) => [...cards, ...expiredCards]));
  }

  public async openFileConsideringPlatform() {
    const deviceInfo = await Device.getInfo();

    switch (deviceInfo.platform) {
      case "ios": {
        this.select();
        break;
      }
      case "android": {
        this.select();
        break;
      }
      default: {
        this.htmlInputElement.nativeElement.click();
      }
    }
  }

  public async select() {
    const selectedFileResult = await FilePicker.pickFiles({
      multiple: false,
      readData: true,
    });

    const selectedFile = selectedFileResult.files[0];

    if (selectedFile.name.includes("territory")) {
      this.readFile(this.b64toBlob(selectedFile.data));
    } else {
      alert(this.translateService.instant("territories.wrongFileType"));
    }
  }

  public openTerritoryCardFromWeb(e) {
    this.readFile(this.htmlInputElement.nativeElement.files[0]);
  }

  public readFile(file) {
    const reader = new FileReader();
    reader.onload = () =>
      this.territoryCardService.importTerritory(reader.result as any);
    reader.readAsArrayBuffer(file);
  }

  private b64toBlob(b64Data: string, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
