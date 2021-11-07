import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationState } from '../store/index.reducers';
import { selectIsAppLocked } from '../store/settings/settings.selectors';

@Injectable({ providedIn: 'root' })
export class AppNotLockedGuard implements CanActivate {
  constructor(private router: Router, private store: Store<ApplicationState>) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.pipe(
      select(selectIsAppLocked),
      map((isLocked) =>
        isLocked ? this.router.createUrlTree([{ outlets: { global: ['lock-screen'] } }]) : !isLocked
      )
    );
  }
}
