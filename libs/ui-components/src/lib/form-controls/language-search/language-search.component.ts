import {TranslateService} from '@ngx-translate/core';
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
  public allowedLangList: string[];

  @Output()
  public onChoose = new EventEmitter();

  @Output()
  public onValueReset = new EventEmitter();

  public inputValue = new FormControl();
  public languageList: ToLanguage[];
  public focused: boolean;

  private destroyer = new Subject();

  constructor(private territoryLanguageService: TerritoryLanguageService,
              private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
    if (!!this.initLanguageCode)
    {
      const lang = this.territoryLanguageService.getLanguageByCode(this.initLanguageCode);
      this.inputValue.patchValue(lang.nativeName, {emitEvent: false})
    }

    this.inputValue
      .valueChanges
      .pipe(
        takeUntil(this.destroyer),
        debounceTime(300),
        tap((inputValue) => this.searchLanguage(inputValue))
      ).subscribe();

    if (this.allowedLangList)
    {
      // TODO wenn die Liste gesetzt wird, sollte es nicht möglich sein andere Sprachen zu suchen
      this.languageList = [];
      this.allowedLangList.forEach(langKey => this.languageList.push(this.territoryLanguageService.getLanguageByCode(langKey)));
    }
  }

  public ngOnDestroy()
  {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public toggleList()
  {
    if (this.focused)
    {
      setTimeout(() => this.focused = false, 200);
    }
    else
    {
      this.focused = true;
    }
  }

  public chooseLanguage(language: ToLanguage)
  {
    this.inputValue.patchValue(language.nativeName, {emitEvent: false})
    if (!this.allowedLangList)
    {
      this.languageList = null;
    }
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
