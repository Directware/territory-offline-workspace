import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-more',
  templateUrl: './home-more.component.html',
  styleUrls: ['./home-more.component.scss'],
})
export class HomeMoreComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  public navigate(link: string, fragment?: string) {
    this.router.navigate([link], { fragment: fragment });
    setTimeout(() => {
      this.router.navigate([link]);
    }, 100);
  }
}
