import {Component, OnInit, Input, Output, EventEmitter, HostBinding, Renderer2} from '@angular/core';

@Component({
  selector: 'app-features-main-item',
  templateUrl: './features-main-item.component.html',
  styleUrls: ['./features-main-item.component.scss']
})
export class FeaturesMainItemComponent implements OnInit {
  @HostBinding('class.odd') @Input() public odd: boolean;
  @HostBinding('class.first') @Input() public first: boolean;
  @HostBinding('class.last') @Input() public last: boolean;
  @Input() public image: string;
  @Input() public pattern: string;
  @Input() public feature: string;
  @Input() public showNext: boolean;
  @Output() public next = new EventEmitter();
  public maximized = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {}

  public openDialog() {
    this.renderer.addClass(document.body, 'menu');
    this.maximized = true;
  }

  public closeDialog() {
    this.renderer.removeClass(document.body, 'menu');
    this.maximized = false;
  }

  public nextFeature() {
    this.next.emit();
  }
}
