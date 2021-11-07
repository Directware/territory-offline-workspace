import { Component, OnInit, Input, HostListener } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-features-main',
  templateUrl: './features-main.component.html',
  styleUrls: ['./features-main.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [style({ opacity: 1 }), animate('0s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class FeaturesMainComponent implements OnInit {
  @Input() public active: number;
  constructor(private scroll: ScrollToService) {}

  public ngOnInit() {}

  public click(number: number, target: string) {
    if (window.innerWidth < 1440) {
      this.active = number;
    } else {
      this.scroll.scrollTo({ target });
    }
  }
}
