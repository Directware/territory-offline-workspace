import {Component, OnInit} from '@angular/core';
import {TerritoryMapsService} from "../../../../core/services/territory/territory-maps.service";
import {PrintedMapConfiguration, Territory} from "@territory-offline-workspace/api";

@Component({
  selector: 'app-print-territory-heading',
  templateUrl: './print-territory-heading.component.html',
  styleUrls: ['./print-territory-heading.component.scss']
})
export class PrintTerritoryHeadingComponent implements OnInit
{
  public territory: Territory;
  public printedMapConfiguration: PrintedMapConfiguration;
  public currentBearing: number;

  constructor(private territoryMapsService: TerritoryMapsService)
  {
  }

  public ngOnInit(): void
  {
    this.currentBearing = this.territoryMapsService.getMap().getBearing() * -1;
    this.territoryMapsService.getMap().on("rotate", (data) => this.currentBearing = (data.target.getBearing() * -1));
  }

  public resetNorth()
  {
    this.territoryMapsService.resetNorth();
  }

  public blackBackground()
  {
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBARXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAACKADAAQAAAABAAAACAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8IAEQgACAAIAwERAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAMCBAEFAAYHCAkKC//EAMMQAAEDAwIEAwQGBAcGBAgGcwECAAMRBBIhBTETIhAGQVEyFGFxIweBIJFCFaFSM7EkYjAWwXLRQ5I0ggjhU0AlYxc18JNzolBEsoPxJlQ2ZJR0wmDShKMYcOInRTdls1V1pJXDhfLTRnaA40dWZrQJChkaKCkqODk6SElKV1hZWmdoaWp3eHl6hoeIiYqQlpeYmZqgpaanqKmqsLW2t7i5usDExcbHyMnK0NTV1tfY2drg5OXm5+jp6vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAQIAAwQFBgcICQoL/8QAwxEAAgIBAwMDAgMFAgUCBASHAQACEQMQEiEEIDFBEwUwIjJRFEAGMyNhQhVxUjSBUCSRoUOxFgdiNVPw0SVgwUThcvEXgmM2cCZFVJInotIICQoYGRooKSo3ODk6RkdISUpVVldYWVpkZWZnaGlqc3R1dnd4eXqAg4SFhoeIiYqQk5SVlpeYmZqgo6SlpqeoqaqwsrO0tba3uLm6wMLDxMXGx8jJytDT1NXW19jZ2uDi4+Tl5ufo6ery8/T19vf4+fr/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2gAMAwEAAhEDEQAAAfzH7OP/2gAIAQEAAQUCf//aAAgBAxEBPwF//9oACAECEQE/AX//2gAIAQEABj8Cf//EADMQAQADAAICAgICAwEBAAACCwERACExQVFhcYGRobHB8NEQ4fEgMEBQYHCAkKCwwNDg/9oACAEBAAE/Ib//2gAMAwEAAhEDEQAAEB//xAAzEQEBAQADAAECBQUBAQABAQkBABEhMRBBUWEgcfCRgaGx0cHh8TBAUGBwgJCgsMDQ4P/aAAgBAxEBPxC//9oACAECEQE/EL//2gAIAQEAAT8Qv//Z";
  }
}
