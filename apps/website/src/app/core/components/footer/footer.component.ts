import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  public navigate(link: string, fragment?: string) {
    this.router.navigate([link], { fragment: fragment });
    setTimeout(() => {
      this.router.navigate([link]);
    }, 100);
  }
}
