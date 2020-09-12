import {Component, OnInit} from '@angular/core';
import * as Pako from 'pako';

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

  public ngOnInit(): void
  {
  }

  public openTerritoryFile(event)
  {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length)
    {
      const [file] = event.target.files;
      reader.onload = () => this.importTerritory(reader.result as any);
      reader.readAsArrayBuffer(file);
    }
  }

  private importTerritory(data)
  {
    const unzippedData = Pako.inflate(new Uint8Array(data), {to: 'string'});
    if (unzippedData)
    {
      const parsedData = JSON.parse(unzippedData);


      console.log(parsedData);
    }
  }
}
