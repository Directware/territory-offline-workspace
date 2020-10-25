import { TranslateService } from '@ngx-translate/core';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {debounceTime, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {TerritoryLanguageService, ToLanguage} from "../../services/territory-language.service";

@Component({
  selector: 'app-language-search',
  templateUrl: './language-search.component.html',
  styleUrls: ['./language-search.component.scss']
})
export class LanguageSearchComponent implements OnInit, OnDestroy
{
  @Input()
  public initLanguageCode: string;

  @Input()
  public required: boolean;

  @Input()
  public label: string;

  @Output()
  public onChoose = new EventEmitter();

  @Output()
  public onValueReset = new EventEmitter();

  public inputValue = new FormControl();
  public languageList: ToLanguage[];

  private destroyer = new Subject();

  constructor(private territoryLanguageService: TerritoryLanguageService, private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
    this.translate.get('language').subscribe((translation: string) => {
      if (!!this.initLanguageCode)
      {
        const lang = this.territoryLanguageService.getLanguageByCode(this.initLanguageCode);
        this.inputValue.patchValue(lang.nativeName, {emitEvent: false})
      }

      if(!this.label)
      {
        this.label = translation;
      }

      this.inputValue
        .valueChanges
        .pipe(
          takeUntil(this.destroyer),
          debounceTime(300),
          tap((inputValue) => this.searchLanguage(inputValue))
        ).subscribe();
    });
  }

  public ngOnDestroy()
  {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public chooseLanguage(language: ToLanguage)
  {
    this.inputValue.patchValue(language.nativeName, {emitEvent: false})
    this.languageList = null;
    this.onChoose.emit(language);
  }

  private searchLanguage(inputValue: string)
  {
    if (inputValue)
    {
      this.languageList = this.territoryLanguageService.searchLanguage(inputValue);
    }
    this.onValueReset.emit();
  }
}
