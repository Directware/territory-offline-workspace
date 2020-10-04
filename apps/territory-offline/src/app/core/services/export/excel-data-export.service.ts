import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import {PlatformAgnosticActionsService} from "../common/platform-agnostic-actions.service";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../store/index.reducers";
import {selectPublishers} from "../../store/publishers/publishers.selectors";
import {first, take, tap} from "rxjs/operators";
import {selectAllVisitBans} from "../../store/visit-bans/visit-bans.selectors";
import {Assignment, VisitBan} from "@territory-offline-workspace/api";
import {selectAllTerritories} from "../../store/territories/territories.selectors";
import {
  selectLastAssignmentOfEachTerritory,
  selectLastEndedAssignmentOfEachTerritory
} from "../../store/assignments/assignments.selectors";
import {selectSettings} from "../../store/settings/settings.selectors";
import * as moment from "moment";

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

  /*
  Anzahl Gebiete, die:
    - Stand jetzt nicht bearbeitet sind
    - länger als 1.5 Jahren nicht bearbeitet sind
    - länger als 3 Jahre nicht bearbeitet sind
    - länger als 5 Jahre nicht bearbeitet sind
    - länger als 10 Jahre nicht bearbeitet sind
* */
  public async exportTerritoryState()
  {
    const assignments = await this.store.pipe(select(selectLastEndedAssignmentOfEachTerritory), first()).toPromise();
    const settings = await this.store.pipe(select(selectSettings), first()).toPromise();
    const today = moment(new Date());

    const countOfAllNotProcessed = assignments.map(a => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") > settings.processingPeriodInMonths)
      .length;

    const oneYear = assignments.map(a => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") >= 12)
      .length;

    const oneAndHalfYear = assignments.map(a => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") >= 18)
      .length;

    const threeYears = assignments.map(a => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") >= 36)
      .length;

    const fiveYears = assignments.map(a => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") >= 60)
      .length;

    const tenYears = assignments.map(a => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") >= 120)
      .length;

    const wb = this.craeteWorkBook("Territory state");
    wb.SheetNames.push("Gebietszustand");

    const tmp = [
      [`${settings.processingPeriodInMonths} Monate nicht bearbeitet`, "1 Jahr nicht bearbeitet", "1.5 Jahre nicht bearbeitet", "3 Jahre nicht bearbeitet", "5 Jahre nicht bearbeitet", "10 Jahre nicht bearbeitet"],
      [countOfAllNotProcessed, oneYear, oneAndHalfYear, threeYears, fiveYears, tenYears]
    ];

    const ws = XLSX.utils.aoa_to_sheet(tmp);
    wb.Sheets["Gebietszustand"] = ws;
    this.saveWorkBook(wb, "Gebietszustand");
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
