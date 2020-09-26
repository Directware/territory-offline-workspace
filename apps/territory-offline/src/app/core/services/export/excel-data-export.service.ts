import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import {PlatformAgnosticActionsService} from "../common/platform-agnostic-actions.service";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../store/index.reducers";
import {selectPublishers} from "../../store/publishers/publishers.selectors";
import {take, tap} from "rxjs/operators";
import {selectAllVisitBans} from "../../store/visit-bans/visit-bans.selectors";
import {VisitBan} from "@territory-offline-workspace/api";
import {selectAllTerritories} from "../../store/territories/territories.selectors";

@Injectable({
  providedIn: 'root'
})
export class ExcelDataExportService
{
  constructor(private store: Store<ApplicationState>, private platformAgnosticActionsService: PlatformAgnosticActionsService)
  {
  }

  public exportPublishers()
  {
    this.store.pipe(
      select(selectPublishers),
      take(1),
      tap(publishers =>
      {
        const wb = this.craeteWorkBook("Publisher");
        wb.SheetNames.push("Verkündiger");

        const tmp = [["Vorname", "Nachname", "E-Mail", "Telefon"]];
        publishers.forEach((p, index) => tmp[index + 1] = [p.firstName, p.name, p.email || "-", p.phone || "-"]);
        const ws = XLSX.utils.aoa_to_sheet(tmp);
        wb.Sheets["Verkündiger"] = ws;
        this.saveWorkBook(wb, "Verkündiger");
      })
    ).subscribe();
  }

  public exportTerritoryNames()
  {
    this.store.pipe(
      select(selectAllTerritories),
      take(1),
      tap(territories =>
      {
        const wb = this.craeteWorkBook("Territory");
        wb.SheetNames.push("Gebiete");

        const tmp = [["Nummer", "Bezeichnung"]];
        territories.forEach((t, index) => tmp[index + 1] = [t.key, t.name]);
        const ws = XLSX.utils.aoa_to_sheet(tmp);
        wb.Sheets["Gebiete"] = ws;
        this.saveWorkBook(wb, "Gebiete");
      })
    ).subscribe();
  }

  public exportVisitBans()
  {
    this.store.pipe(
      select(selectAllVisitBans),
      take(1),
      tap((visitBans: VisitBan[]) =>
      {
        const wb = this.craeteWorkBook("Nicht besuchen");
        wb.SheetNames.push("Nicht besuchen");

        const tmp = [["Name", "Stock", "Straße", "Nr.", "Stadt", "Letzter Besuch", "Kommentar", "Breitengrad", "Längengrad"]];
        visitBans.forEach((a, index) => tmp[index + 1] = [
          a.name,
          a.floor + "",
          a.street,
          a.streetSuffix,
          a.city,
          !!a.lastVisit ? new Date(a.lastVisit).toLocaleDateString() : "",
          a.comment,
          a.gpsPosition ? a.gpsPosition.lat + "" : "",
          a.gpsPosition ? a.gpsPosition.lng + "" : "",
        ]);
        const ws = XLSX.utils.aoa_to_sheet(tmp);
        wb.Sheets["Nicht besuchen"] = ws;
        this.saveWorkBook(wb, "Nicht besuchen Adressen");
      })
    ).subscribe();
  }

  private craeteWorkBook(subject: string)
  {
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "Territory Offline",
      Subject: subject,
      Author: "to",
      CreatedDate: new Date()
    };

    return wb;
  }

  private async saveWorkBook(workBook: any, fileName: string)
  {
    const today = new Date();
    const wbout = XLSX.write(workBook, {bookType: 'xlsx', type: 'binary'});
    await this.platformAgnosticActionsService.share(wbout, `${fileName} - ${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}.xlsx`);
  }
}
