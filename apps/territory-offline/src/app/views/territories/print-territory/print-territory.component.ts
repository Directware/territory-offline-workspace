import { TranslateService } from '@ngx-translate/core';
import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {TerritoryMapsService} from '../../../core/services/territory/territory-maps.service';
import {PrintTerritoryBackComponent} from "./print-territory-back/print-territory-back.component";
import {PrintTerritoryHeadingComponent} from "./print-territory-heading/print-territory-heading.component";
import {take, tap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {selectTerritoryById} from "../../../core/store/territories/territories.selectors";
import {SaveDrawingPrintAlignmentConfiguration} from "../../../core/store/drawings/drawings.actions";
import {selectDrawingById} from "../../../core/store/drawings/drawings.selectors";
import {IpcService} from "../../../core/services/common/ipc.service";
import {
  PrintedMapConfiguration,
  Territory,
  TerritoryCardFormat,
  TerritoryCardFormats
} from "@territory-offline-workspace/api";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-print-territory',
  templateUrl: './print-territory.component.html',
  styleUrls: ['./print-territory.component.scss']
})
export class PrintTerritoryComponent implements OnInit, OnDestroy
{
  /* Configurations */
  public printedMapConfiguration: PrintedMapConfiguration;
  public tcf: TerritoryCardFormat;
  public territoryCardFormats = TerritoryCardFormats;

  /* DOM Element Refs */
  private mapDomElement: HTMLElement;
  private perspective3DElement: HTMLElement;
  private mapBackComponentRef: ComponentRef<PrintTerritoryBackComponent>;
  private mapHeadingComponentRef: ComponentRef<PrintTerritoryHeadingComponent>;

  /* Helper */
  public isFlipped: boolean;
  private initialMapPadding;
  private territory: Territory;
  private destroyer = new Subject();

  constructor(
    private store: Store<ApplicationState>,
    private activatedRoute: ActivatedRoute,
    private renderer2: Renderer2,
    private injector: Injector,
    private appRef: ApplicationRef,
    private ipcService: IpcService,
    private territoryMapsService: TerritoryMapsService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private translate: TranslateService
  )
  {
  }

  public ngOnInit(): void
  {
    this.getLastPrintingPreferences();
    this.initialMapPadding = this.territoryMapsService.getCachedPadding();

    this.store
      .pipe(
        select(selectTerritoryById, this.activatedRoute.snapshot.params.id),
        take(1),
        tap(territory => this.territory = territory),
        tap((territory: Territory) => this.initWithData(territory)),
        tap((territory: Territory) => this.territoryMapsService.setPrintingDrawingColor())
      ).subscribe()
  }

  public ngOnDestroy(): void
  {
    if (this.mapDomElement)
    {
      this.renderer2.removeClass(this.mapDomElement, "has-bleeding-edges");
      this.renderer2.setStyle(this.mapDomElement, 'width', "100%");
      this.renderer2.setStyle(this.mapDomElement, 'height', "100%");
      this.renderer2.setStyle(this.mapDomElement, 'overflow', 'hidden');
      this.renderer2.removeStyle(this.mapDomElement, 'position');
      this.renderer2.removeStyle(this.mapDomElement, 'right');
      this.renderer2.removeStyle(this.mapDomElement, 'top');
      this.renderer2.setStyle(this.mapDomElement.querySelector(".mapboxgl-control-container"), 'display', 'initial');

      if (this.isFlipped)
      {
        this.flipCard();
      }
    }

    if (this.perspective3DElement)
    {
      this.renderer2.removeClass(this.perspective3DElement, "print");
    }

    this.appRef.detachView(this.mapBackComponentRef.hostView);
    this.mapBackComponentRef.destroy();

    this.appRef.detachView(this.mapHeadingComponentRef.hostView);
    this.mapHeadingComponentRef.destroy();

    this.territoryMapsService.getMap().resize();

    setTimeout(() =>
    {
      this.territoryMapsService.removePrintingDrawingColor();
      this.territoryMapsService.setPadding(this.initialMapPadding);
    }, 500);

    this.destroyer.next();
    this.destroyer.complete();
  }

  public changeFormat(format: TerritoryCardFormat)
  {
    if (this.tcf.id !== format.id)
    {
      this.tcf = format;
      this.mapBackComponentRef.instance.refreshStats(this.tcf, this.printedMapConfiguration);
      this.scaleMapViewToCurrentFormat();
      this.applyDrawingPrintAlignment();
      this.savePrintConfiguration();
    }
  }

  public print()
  {
    this.saveDrawingPrintAlignment(true);

    if(environment.production)
    {
      setTimeout(() => this.ipcService.send("print"), 500);
    }
    else
    {
      setTimeout(() => window.print(), 0);
    }
  }

  public goBack()
  {
    window.history.back();
  }

  public resetNorth()
  {
    this.territoryMapsService.resetNorth();
  }

  public autoZoom()
  {
    this.territoryMapsService.setPadding({
      right: 12,
      top: 46,
      left: 12,
      bottom: 12
    });
  }

  public saveDrawingPrintAlignment(silent?: boolean)
  {
    if (this.territory)
    {
      this.store.dispatch(SaveDrawingPrintAlignmentConfiguration({
        drawingId: this.territory.territoryDrawingId,
        config: this.territoryMapsService.getMapParametersSnapshot()
      }));

      if (!silent)
      {
        this.translate.get('territory.print.alignmentSaved').pipe(take(1)).subscribe((translation: string) =>
          alert(translation));
      }
    }
  }

  public flipCard()
  {
    if (this.isFlipped)
    {
      this.isFlipped = false;
      this.renderer2.removeStyle(this.mapDomElement, "transform")
    }
    else
    {
      this.isFlipped = true;
      this.renderer2.setStyle(this.mapDomElement, "transform", "rotateX(180deg)")
    }
  }

  public toggleProp(propName: string)
  {
    this.printedMapConfiguration[propName] = !this.printedMapConfiguration[propName];
    this.savePrintConfiguration();
    if (propName === "bleedEdges")
    {
      this.scaleMapViewToCurrentFormat();
      this.applyDrawingPrintAlignment();
      if (this.printedMapConfiguration.bleedEdges)
      {
        this.renderer2.addClass(this.mapDomElement, "has-bleeding-edges");
      }
      else
      {
        this.renderer2.removeClass(this.mapDomElement, "has-bleeding-edges");
      }
      this.handleBleedingEdges();
      this.mapBackComponentRef.instance.refreshStats(this.tcf, this.printedMapConfiguration);
    }

    if (propName === "showComment" || propName === "showBoundaryNames")
    {
      this.mapBackComponentRef.instance.refreshStats(this.tcf, this.printedMapConfiguration);
    }

    this.territoryMapsService.getMap().resize();
  }

  private initWithData(territory: Territory)
  {
    this.scaleMapViewToCurrentFormat();
    this.createMapHeading(territory);
    this.createMapBack(territory);
    this.applyDrawingPrintAlignment();
  }

  private applyDrawingPrintAlignment()
  {
    this.store.pipe(
      select(selectDrawingById, this.territory.territoryDrawingId),
      take(1),
      tap((territoryDrawing) => territoryDrawing.printConfiguration
        ? this.territoryMapsService.applyMapParameterSnapshot(territoryDrawing.printConfiguration)
        : this.autoZoom())
    ).subscribe();
  }

  private scaleMapViewToCurrentFormat()
  {
    this.mapDomElement = document.getElementById('map');
    this.perspective3DElement = document.getElementById('perspective-3d');

    let width = this.tcf.dimensions.w;
    let height = this.tcf.dimensions.h;

    if (this.printedMapConfiguration.bleedEdges)
    {
      width = width + 6;
      height = height + 6;
    }

    this.renderer2.addClass(this.perspective3DElement, "print");
    this.renderer2.setStyle(this.mapDomElement, 'width', (width + this.tcf.dimensions.dim) + "");
    this.renderer2.setStyle(this.mapDomElement, 'height', (height + this.tcf.dimensions.dim) + "");
    this.renderer2.setStyle(this.mapDomElement, 'overflow', 'visible');
    this.renderer2.setStyle(this.mapDomElement.querySelector(".mapboxgl-control-container"), 'display', 'none');
    this.territoryMapsService.getMap().resize();
  }

  private handleBleedingEdges()
  {
    const bleedLinePosition = -5.5;
    const bleedThickness = 3;
    const printCardHeader = this.mapDomElement.querySelector("app-print-territory-heading");
    const line_horizontal_top_left = this.mapDomElement.querySelector(".line.horizontal.top.left");
    const line_horizontal_top_right = this.mapDomElement.querySelector(".line.horizontal.top.right");
    const line_horizontal_bottom_left = this.mapDomElement.querySelector(".line.horizontal.bottom.left");
    const line_horizontal_bottom_right = this.mapDomElement.querySelector(".line.horizontal.bottom.right");
    const line_vertical_top_left = this.mapDomElement.querySelector(".line.vertical.top.left");
    const line_vertical_top_right = this.mapDomElement.querySelector(".line.vertical.top.right");
    const line_vertical_bottom_left = this.mapDomElement.querySelector(".line.vertical.bottom.left");
    const line_vertical_bottom_right = this.mapDomElement.querySelector(".line.vertical.bottom.right");

    const back_line_horizontal_top_left_ALL = this.mapDomElement.querySelectorAll("app-print-territory-back .line.horizontal.top.left");
    const back_line_horizontal_top_right_ALL = this.mapDomElement.querySelectorAll("app-print-territory-back .line.horizontal.top.right");
    const back_line_horizontal_bottom_left_ALL = this.mapDomElement.querySelectorAll("app-print-territory-back .line.horizontal.bottom.left");
    const back_line_horizontal_bottom_right_ALL = this.mapDomElement.querySelectorAll("app-print-territory-back .line.horizontal.bottom.right");
    const back_line_vertical_top_left_ALL = this.mapDomElement.querySelectorAll("app-print-territory-back .line.vertical.top.left");
    const back_line_vertical_top_right_ALL = this.mapDomElement.querySelectorAll("app-print-territory-back .line.vertical.top.right");
    const back_line_vertical_bottom_left_ALL = this.mapDomElement.querySelectorAll("app-print-territory-back .line.vertical.bottom.left");
    const back_line_vertical_bottom_right_ALL = this.mapDomElement.querySelectorAll("app-print-territory-back .line.vertical.bottom.right");

    if (this.printedMapConfiguration.bleedEdges)
    {
      this.renderer2.addClass(this.mapDomElement, "has-bleeding-edges");
      this.renderer2.setStyle(printCardHeader, "top", "5mm");
      this.renderer2.setStyle(printCardHeader, "left", "5mm");
    }
    else
    {
      this.renderer2.removeClass(this.mapDomElement, "has-bleeding-edges");
      this.renderer2.setStyle(printCardHeader, "top", "2mm");
      this.renderer2.setStyle(printCardHeader, "left", "2mm");
    }

    this.renderer2.setStyle(line_horizontal_top_left, "bottom", (this.tcf.dimensions.h + bleedThickness) + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_horizontal_top_left, "left", bleedLinePosition + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_horizontal_top_right, "bottom", (this.tcf.dimensions.h + bleedThickness) + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_horizontal_top_right, "right", bleedLinePosition + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_horizontal_bottom_left, "top", (this.tcf.dimensions.h + bleedThickness) + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_horizontal_bottom_left, "left", bleedLinePosition + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_horizontal_bottom_right, "top", (this.tcf.dimensions.h + bleedThickness) + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_horizontal_bottom_right, "right", bleedLinePosition + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_vertical_top_left, "top", bleedLinePosition + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_vertical_top_left, "right", (this.tcf.dimensions.w + bleedThickness) + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_vertical_top_right, "top", bleedLinePosition + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_vertical_top_right, "left", (this.tcf.dimensions.w + bleedThickness) + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_vertical_bottom_left, "bottom", bleedLinePosition + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_vertical_bottom_left, "right", (this.tcf.dimensions.w + bleedThickness) + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_vertical_bottom_right, "bottom", bleedLinePosition + this.tcf.dimensions.dim);
    this.renderer2.setStyle(line_vertical_bottom_right, "left", (this.tcf.dimensions.w + bleedThickness) + this.tcf.dimensions.dim);


    back_line_horizontal_top_left_ALL.forEach(elem =>
    {
      this.renderer2.setStyle(elem, "bottom", (this.tcf.dimensions.h - bleedThickness) + this.tcf.dimensions.dim);
      this.renderer2.setStyle(elem, "left", bleedLinePosition + this.tcf.dimensions.dim);
    });

    back_line_horizontal_top_right_ALL.forEach(elem =>
    {
      this.renderer2.setStyle(elem, "bottom", (this.tcf.dimensions.h - bleedThickness) + this.tcf.dimensions.dim);
      this.renderer2.setStyle(elem, "right", bleedLinePosition + this.tcf.dimensions.dim);
    });

    back_line_horizontal_bottom_left_ALL.forEach(elem =>
    {
      this.renderer2.setStyle(elem, "top", (this.tcf.dimensions.h - bleedThickness) + this.tcf.dimensions.dim);
      this.renderer2.setStyle(elem, "left", bleedLinePosition + this.tcf.dimensions.dim);

    });

    back_line_horizontal_bottom_right_ALL.forEach(elem =>
    {
      this.renderer2.setStyle(elem, "top", (this.tcf.dimensions.h - bleedThickness) + this.tcf.dimensions.dim);
      this.renderer2.setStyle(elem, "right", bleedLinePosition + this.tcf.dimensions.dim);
    });

    back_line_vertical_top_left_ALL.forEach(elem =>
    {
      this.renderer2.setStyle(elem, "top", bleedLinePosition + this.tcf.dimensions.dim);
      this.renderer2.setStyle(elem, "right", (this.tcf.dimensions.w + bleedThickness) + this.tcf.dimensions.dim);

    });

    back_line_vertical_top_right_ALL.forEach(elem =>
    {
      this.renderer2.setStyle(elem, "top", bleedLinePosition + this.tcf.dimensions.dim);
      this.renderer2.setStyle(elem, "left", (this.tcf.dimensions.w + bleedThickness) + this.tcf.dimensions.dim);

    });

    back_line_vertical_bottom_left_ALL.forEach(elem =>
    {
      this.renderer2.setStyle(elem, "bottom", bleedLinePosition + this.tcf.dimensions.dim);
      this.renderer2.setStyle(elem, "right", (this.tcf.dimensions.w + bleedThickness) + this.tcf.dimensions.dim);

    });

    back_line_vertical_bottom_right_ALL.forEach(elem =>
    {
      this.renderer2.setStyle(elem, "bottom", bleedLinePosition + this.tcf.dimensions.dim);
      this.renderer2.setStyle(elem, "left", (this.tcf.dimensions.w + bleedThickness) + this.tcf.dimensions.dim);
    });
  }

  private createMapBack(territory: Territory)
  {
    this.mapBackComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(PrintTerritoryBackComponent)
      .create(this.injector);

    this.mapBackComponentRef.instance.territory = territory;

    setTimeout(() => this.mapBackComponentRef.instance.refreshStats(this.tcf, this.printedMapConfiguration), 0);
    setTimeout(() => this.handleBleedingEdges(), 500);

    this.appRef.attachView(this.mapBackComponentRef.hostView);

    const domElem = (this.mapBackComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    this.mapDomElement.appendChild(domElem);
  }

  private createMapHeading(territory: Territory)
  {
    this.mapHeadingComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(PrintTerritoryHeadingComponent)
      .create(this.injector);

    this.mapHeadingComponentRef.instance.territory = territory;
    this.mapHeadingComponentRef.instance.printedMapConfiguration = this.printedMapConfiguration;

    this.appRef.attachView(this.mapHeadingComponentRef.hostView);

    const domElem = (this.mapHeadingComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    this.mapDomElement.querySelector(".mapboxgl-canvas-container").appendChild(domElem);
  }

  private savePrintConfiguration()
  {
    this.mapHeadingComponentRef.instance.printedMapConfiguration = this.printedMapConfiguration;
    localStorage.setItem("printedMapConfiguration", JSON.stringify({
      ...this.printedMapConfiguration,
      chosenFormatId: this.tcf.id
    }));
  }

  private getLastPrintingPreferences()
  {
    this.printedMapConfiguration = JSON.parse(localStorage.getItem("printedMapConfiguration")) || {};
    this.tcf = TerritoryCardFormats.filter((format) => format.id === this.printedMapConfiguration.chosenFormatId)[0];

    if (!this.tcf)
    {
      this.tcf = TerritoryCardFormats[0];
    }
  }
}
