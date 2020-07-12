import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-territory-preview',
  templateUrl: './territory-preview.component.html',
  styleUrls: ['./territory-preview.component.scss']
})
export class TerritoryPreviewComponent implements OnInit
{

  constructor(private router: Router)
  {
  }

  public ngOnInit(): void
  {
  }
}
