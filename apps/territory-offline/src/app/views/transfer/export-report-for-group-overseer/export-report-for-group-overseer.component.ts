import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {AbstractControl, FormControl, ValidatorFn} from "@angular/forms";
import {PdfDataExportService} from "../../../core/services/export/pdf-data-export.service";

@Component({
  selector: 'to-export-report-for-group-overseer',
  templateUrl: './export-report-for-group-overseer.component.html',
  styleUrls: ['./export-report-for-group-overseer.component.scss']
})
export class ExportReportForGroupOverseerComponent implements OnInit
{
  public readonly localStorageKey = "group-overseer-report-tags";
  public addedTagIds: FormControl;
  public saveTagsForNextTime: boolean;

  constructor(private store: Store<ApplicationState>,
              private router: Router,
              private pdfDataExportService: PdfDataExportService)
  {
  }

  public ngOnInit(): void
  {
    this.addedTagIds = new FormControl([], [this.minArrayLengthValidator(1)]);
    this.readSavedTags();
  }

  public back()
  {
    this.router.navigate([{outlets: {'second-thread': null}}]);
  }

  public createReport()
  {
    if (this.saveTagsForNextTime)
    {
      this.saveTagsFormNextTime();
    }
    else
    {
      localStorage.removeItem(this.localStorageKey);
    }

    this.pdfDataExportService.exportGroupOverseerReport(this.addedTagIds.value).then(() => this.back());
  }

  public readSavedTags()
  {
    const result = localStorage.getItem(this.localStorageKey);

    if (result)
    {
      this.saveTagsForNextTime = true;
      const ids = JSON.parse(result) as string[];
      this.addedTagIds.patchValue(ids);
    }
  }

  public saveTagsFormNextTime()
  {
    const tags = this.addedTagIds.value as string[];
    localStorage.setItem(this.localStorageKey, JSON.stringify(tags));
  }

  public minArrayLengthValidator(min: number): ValidatorFn
  {
    return (control: AbstractControl) =>
    {
      if (control.value && control.value.length >= min)
      {
        return null;
      }

      return {minArrayLength: true};
    }
  }
}
