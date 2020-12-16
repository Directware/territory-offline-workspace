import {AppComponent} from './app.component';
import {Store} from "@ngrx/store";
import {Subject} from "rxjs";

describe('AppComponent', () =>
{
  let appComponent: AppComponent;

  let actions$;
  let state$;
  let reducerManager$;

  beforeEach(() =>
  {
    actions$ = new Subject();
    state$ = new Subject();
    reducerManager$ = new Subject();
    appComponent = new AppComponent(new Store(state$, actions$, reducerManager$), null, actions$, null);
  });

  it('should create app component class', () =>
  {
    expect(appComponent).toBeTruthy();
  });

  it('should lock app when press CMD+SHIFT+L', () =>
  {
    const keyboardEvent = {code: "KeyL", ctrlKey: true, shiftKey: true} as KeyboardEvent;

    appComponent.keyboardInputListener(keyboardEvent);

  });
  /*

  it(`should have as title 'territory-offline-v2'`, () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('territory-offline-v2');
  });

  it('should render title', () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('territory-offline-v2 app is running!');
  });
  */
});
