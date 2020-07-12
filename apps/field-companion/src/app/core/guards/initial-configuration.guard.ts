import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../store/index.reducers";
import {Observable} from "rxjs";
import {selectInitialConfigurationDone} from "../store/settings/settings.selectors";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class InitialConfigurationGuard implements CanActivate
{
  constructor(private router: Router, private store: Store<ApplicationState>)
  {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>
  {
    return this.store.pipe(
      select(selectInitialConfigurationDone),
      map((alreadyDone: boolean) => alreadyDone ? alreadyDone : this.router.createUrlTree(["welcome"]))
    );
  }
}
