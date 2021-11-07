import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-features-start-now',
  templateUrl: './features-start-now.component.html',
  styleUrls: ['./features-start-now.component.scss'],
})
export class FeaturesStartNowComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  public navigate(link: string, fragment?: string) {
    this.router.navigate([link], { fragment: fragment });
    setTimeout(() => {
      this.router.navigate([link]);
    }, 100);
  }
}
