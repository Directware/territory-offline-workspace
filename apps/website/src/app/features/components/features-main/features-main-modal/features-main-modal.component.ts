import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-features-main-modal',
  templateUrl: './features-main-modal.component.html',
  styleUrls: ['./features-main-modal.component.scss'],
})
export class FeaturesMainModalComponent implements OnInit {
  @Input() image: string;
  @Output() close = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public emitClose() {
    this.close.emit();
  }
}
