import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.scss']
})
export class MainSearchComponent implements OnInit, OnDestroy
{
  @Output()
  public onSearch = new EventEmitter();

  @Output()
  public onBlur = new EventEmitter();

  public searchFormControl = new FormControl();
  private destroyer = new Subject();

  constructor()
  {
  }

  public ngOnInit(): void
  {
    this.registerValueChangesHandler();
  }

  public ngOnDestroy(): void
  {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public blur()
  {
    this.onBlur.emit(this.searchFormControl.value);
  }

  public clearSearch(inputElement)
  {
    inputElement.value = "";
    this.searchFormControl.setValue("");
  }

  private registerValueChangesHandler()
  {
    this.searchFormControl
      .valueChanges
      .pipe(
        debounceTime(400),
        takeUntil(this.destroyer),
        tap((searchValue) => this.onSearch.emit(searchValue))
      ).subscribe();
  }
}
