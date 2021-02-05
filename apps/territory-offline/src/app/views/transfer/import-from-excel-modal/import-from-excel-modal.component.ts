import {take} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import * as XLSX from 'xlsx';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-import-from-excel-modal',
  templateUrl: './import-from-excel-modal.component.html',
  styleUrls: ['./import-from-excel-modal.component.scss']
})
export class ImportFromExcelModalComponent implements OnInit
{
  public currentStep: number;
  public fileName: string;
  public workbook: XLSX.WorkBook;

  constructor(private dialogRef: MatDialogRef<ImportFromExcelModalComponent>, private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
    this.currentStep = 0;
  }

  public cancel()
  {
    this.dialogRef.close();
  }

  public async importFile(event)
  {
    const excelFileReader = new FileReader();

    if (event.target.files && event.target.files.length)
    {
      const [file] = event.target.files;

      if (file.name.endsWith(".xlsx"))
      {
        this.fileName = file.name;
        excelFileReader.onload = () => this.workbook = XLSX.read(excelFileReader.result, {type: 'binary'});
        excelFileReader.readAsBinaryString(file);
      }
      else
      {
        const translation = await this.translate.get('transfer.import.noExcelFile', {file: file.name}).pipe(take(1)).toPromise();
        alert(translation);
      }
    }
  }
}
