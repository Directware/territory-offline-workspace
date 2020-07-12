import {Injectable} from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfMakeFonts from "pdfmake/build/vfs_fonts.js";
import {Publisher} from "../../store/publishers/model/publisher.model";
import {VisitBan} from "../../store/visit-bans/model/visit-ban.model";
import {Assignment} from "../../store/assignments/model/assignment.model";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../store/index.reducers";
import {selectCurrentCongregation} from "../../store/congregation/congregations.selectors";
import {take} from "rxjs/operators";
import {selectAllAssignmentsOrderedByRelevantTags} from "../../store/assignments/assignments.selectors";

@Injectable({
  providedIn: 'root'
})
export class PdfDataExportService
{
  constructor(private store: Store<ApplicationState>)
  {
    /* Die Fonts werden in der vfs_fonts.js nicht an die richtige Stelle gebunden(durch webpack)
       daher dieser Workaround
    */
    pdfMake.vfs = pdfMakeFonts.pdfMake.vfs;
  }

  public exportPublisher(publisher: Publisher[])
  {
    const body = [];
    publisher.forEach((p, index) =>
      body[index] = [p.firstName, p.name, p.email || "-", p.phone || "-"]);

    const table = {
      layout: 'lightHorizontalLines',
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', '*'],
        body: [
          ["Vorname", "Nachname", "E-Mail", "Telefon"],
          ...body
        ]
      }
    };

    const docDefinition = {
      footer: this.pdfFooter,
      pageMargins: [25, 20, 30, 30],
      content: table
    };

    pdfMake.createPdf(docDefinition).download("to-publisher");
  }

  public exportVisitBans(visitBans: VisitBan[])
  {
    const body = [];
    visitBans.forEach((a, index) =>
      body[index] = [a.name, a.floor, a.street, a.streetSuffix, a.city, !!a.lastVisit ? new Date(a.lastVisit).toLocaleDateString() : ""]);

    const table = {
      layout: 'lightHorizontalLines',
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
        body: [
          ["Klingelposition", "Stock", "Straße", "Nr.", "Stadt", "Letzter Besuch"],
          ...body
        ]
      }
    };

    const docDefinition = {
      footer: this.pdfFooter,
      pageOrientation: 'landscape',
      pageMargins: [25, 20, 30, 20],
      content: table
    };

    pdfMake.createPdf(docDefinition).download("to-visit-bans");
  }

  public async exportS13()
  {
    const data = await this.store.pipe(select(selectAllAssignmentsOrderedByRelevantTags), take(1)).toPromise();
    const content = [];
    const rowCountForWholePage = 37;

    let territoryIndex = 0; // Nötig, weil der index in forEach wird wegen den Tags immer wieder zurückgesetzt
    let columnsPerPageIndex = 0;

    data.forEach(dto =>
      dto.territoryDtos
        .filter(td => td.assignmentDtos.length > 0 && !td.territory.deactivated)
        .sort((dto1, dto2) => dto1.territory.key > dto2.territory.key ? 1 : -1)
        .forEach((td) =>
        {
          if (!content[territoryIndex])
          {
            content[territoryIndex] = {
              layout: 's13Layout',
              table: {
                widths: [81, 81, 81, 81, 81, 81],
                body: [[]]
              },
              fontSize: 13,
              alignment: 'center',
              pageBreak: "after"
            };
          }

          content[territoryIndex].table.body[0].push({colSpan: 2, text: td.territory.key});
          content[territoryIndex].table.body[0].push("");

          const reverseSortedAssignments = [...td.assignmentDtos];
          reverseSortedAssignments.sort((a1, a2) => a1.assignment.startTime > a2.assignment.startTime ? 1 : -1);

          if (reverseSortedAssignments.length > ((rowCountForWholePage + 1) / 2))
          {
            const deletionCount = reverseSortedAssignments.length - ((rowCountForWholePage + 1) / 2);
            reverseSortedAssignments.splice(0, deletionCount);
          }

          for (let i = 0, cellIndex = 0; i <= rowCountForWholePage; i++)
          {
            if (!content[territoryIndex].table.body[i + 1])
            {
              content[territoryIndex].table.body[i + 1] = [];
            }

            const aDto = reverseSortedAssignments[cellIndex];
            if (aDto)
            {
              if (i % 2 === 0)
              {
                const publisherName = aDto.publisher ? `${aDto.publisher.name} ${aDto.publisher.firstName}` : aDto.removedPublisherLabel;
                content[territoryIndex].table.body[i + 1].push({colSpan: 2, text: publisherName});
                content[territoryIndex].table.body[i + 1].push(" ");
              }
              else
              {
                content[territoryIndex].table.body[i + 1].push(...this.assignmentS13DateEntry(aDto.assignment));
                cellIndex++;
              }
            }
            else
            {
              if (i % 2 === 0)
              {
                content[territoryIndex].table.body[i + 1].push({colSpan: 2, text: " "});
                content[territoryIndex].table.body[i + 1].push(" ");
              }
              else
              {
                content[territoryIndex].table.body[i + 1].push(" ", " ");
              }

            }
          }


          if (columnsPerPageIndex < 2)
          {
            columnsPerPageIndex++;
          }
          else
          {
            columnsPerPageIndex = 0;
            territoryIndex++;
          }
        })
    );

    pdfMake.tableLayouts = {
      s13Layout: {
        hLineWidth: function (i, node)
        {
          if (i === 0 || i === 1 || i === node.table.body.length)
          {
            return 2;
          }
          return 0.5;
        },
        vLineWidth: function (i)
        {
          return i % 2 === 0 ? 2 : 0.5;
        }
      }
    };

    const docDefinition = {
      footer: this.pdfFooter,
      pageMargins: [25, 40, 30, 20],
      content: content
    };

    const congregation = await this.store.pipe(select(selectCurrentCongregation), take(1)).toPromise();
    const createdPdf = pdfMake.createPdf(docDefinition);
    createdPdf.download(`${congregation.name} - S13`, () =>
    {
      // DONE
    });
  }

  private assignmentS13DateEntry(assignment: Assignment)
  {
    const start = assignment.startTime.toLocaleDateString();

    if (assignment.endTime)
    {
      return [start, assignment.endTime.toLocaleDateString()];
    }

    return [start, ""];
  }

  private pdfFooter(currentPage, pageCount)
  {
    return [
      {
        alignment: 'center',
        text: `${currentPage.toString()} / ${pageCount}`
      },
      {
        alignment: 'right',
        color: "#aaaaaa",
        text: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
      }
    ];
  }
}
