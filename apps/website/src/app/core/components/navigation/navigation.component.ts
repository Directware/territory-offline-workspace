import {Component, OnInit, Output, EventEmitter, HostListener, ElementRef, HostBinding} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Output() close = new EventEmitter();
  @HostBinding('class.closeAnimation') closeAnimation = false;
  public active = 'home';

  constructor(private router: Router, private eRef: ElementRef) {}

  public ngOnInit() {
    this.active = this.router.url.startsWith('/features') ? 'features' : this.router.url.startsWith('/home') ? 'home' : 'imprint';
  }

  @HostListener('click', ['$event.target'])
  public backdropClick(event: any) {
    if (event.tagName === 'APP-NAVIGATION') {
      this.closeMenu();
    }
  }

  public closeMenu() {
    this.closeAnimation = true;
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }

  public navigate(link: string, fragment?: string) {
    this.router.navigate([link], {fragment: fragment});
    this.closeMenu();
    setTimeout(() => {
      this.router.navigate([link]);
    }, 100);
  }
}
