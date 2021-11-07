import { Component, OnInit, Renderer2 } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navigation-trigger',
  templateUrl: './navigation-trigger.component.html',
  styleUrls: ['./navigation-trigger.component.scss'],
})
export class NavigationTriggerComponent implements OnInit {
  public open = false;
  public active = 'home';

  constructor(private router: Router, private route: ActivatedRoute, private renderer: Renderer2) {}

  public ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.active =
          val && val.url && val.url.startsWith('/features')
            ? 'features'
            : this.router.url.startsWith('/home')
            ? 'home'
            : 'imprint';
      }
    });
  }

  public openMenu() {
    setTimeout(() => {
      this.renderer.addClass(document.body, 'menu');
      this.open = true;
    }, 10);
  }

  public closeMenu() {
    this.renderer.removeClass(document.body, 'menu');
    this.open = false;
  }

  public navigate(link: string, fragment?: string) {
    this.router.navigate([link], { fragment: fragment });
    setTimeout(() => {
      this.router.navigate([link]);
    }, 100);
  }
}
