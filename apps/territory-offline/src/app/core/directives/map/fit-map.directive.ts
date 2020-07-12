import {AfterViewChecked, Directive, ElementRef} from '@angular/core';
import {TerritoryMapsService} from '../../services/territory/territory-maps.service';

@Directive({selector: '[fitMap]'})
export class FitMap implements AfterViewChecked
{
  private lastState: number;
  private throttleDate = new Date();
  private delay = 300;

  private menu: HTMLElement;
  private mainThread: HTMLElement;
  private secondThread: HTMLElement;

  private paddingFactor = 12;

  constructor(
    private territoryMapsService: TerritoryMapsService,
    private elementRef: ElementRef
  )
  {}

  public ngAfterViewChecked()
  {
    if ((new Date().getTime() - this.throttleDate.getTime()) > 1000)
    {
      this.throttleDate = new Date();

      if (!this.menu || !this.mainThread || !this.secondThread)
      {
        this.initDomElements();
        return;
      }

      setTimeout(() => this.considerFitMap(), this.delay);
    }
  }

  private initDomElements()
  {
    this.menu = this.elementRef.nativeElement.parentNode.querySelector('.menu');
    this.mainThread = this.elementRef.nativeElement.parentNode.querySelector('.main-thread');
    this.secondThread = this.elementRef.nativeElement.parentNode.querySelector('.second-thread');
  }

  private considerFitMap()
  {
    if (this.menu && this.mainThread && this.secondThread)
    {
      const menuDim = this.menu.getBoundingClientRect();
      const mainThreadDim = this.mainThread.getBoundingClientRect();
      const secondThreadDim = this.secondThread.getBoundingClientRect();
      const pad = 5 * this.paddingFactor;

      /* Full screen condition */
      if (this.lastState !== 40 && menuDim.x < 0 && mainThreadDim.x < 0 && secondThreadDim.x < 0)
      {
        this.lastState = 40;
        this.territoryMapsService.setPadding({top: pad, right: pad, bottom: pad, left: pad});
        return;
      }

      /* Only one-thread condition */
      if (this.lastState !== 50 && menuDim.left === 0 && ((mainThreadDim.left > 0 && secondThreadDim.left < 0) || (mainThreadDim.left === secondThreadDim.left)))
      {
        this.territoryMapsService.setPadding({top: pad, right: pad, bottom: pad, left: (menuDim.width + mainThreadDim.width + pad)});
        this.lastState = 50;
        return;
      }

      /* Main- & second-thread condition */
      if (this.lastState !== 60 && menuDim.left === 0 && mainThreadDim.left > 0 && secondThreadDim.left > 0 && mainThreadDim.left < secondThreadDim.left)
      {
        this.territoryMapsService.setPadding({top: pad, right: pad, bottom: pad, left: (menuDim.width + mainThreadDim.width + secondThreadDim.width + pad)});
        this.lastState = 60;
        return;
      }
    }
  }
}
