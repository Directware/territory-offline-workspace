import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-territories',
  templateUrl: './territories.component.html',
  styleUrls: ['./territories.component.scss']
})
export class TerritoriesComponent implements OnInit
{
  public isMenuOpened: boolean;

  constructor()
  {
  }

  ngOnInit(): void
  {
  }

}
