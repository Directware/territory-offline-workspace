import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Path, Project } from 'paper';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-publisher-signature',
  templateUrl: './publisher-signature.component.html',
  styleUrls: ['./publisher-signature.component.scss'],
})
export class PublisherSignatureComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('signatureCanvas', { read: ElementRef, static: false })
  public signatureCanvas: ElementRef;

  @Input()
  public signature: FormControl;

  public project;

  public paths = [];

  public canvasX: number;
  public canvasY: number;

  constructor() {}

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    setTimeout(() => this.initCanvas(), 0);
  }

  public ngOnDestroy(): void {}

  public stopWriting() {
    this.paths[this.paths.length - 1].simplify();
    setTimeout(() => this.saveSignature(), 300);

    this.paths.push(
      new Path({
        segments: [],
        strokeColor: '#fff',
        strokeWidth: 2,
      })
    );
  }

  public write(event) {
    this.paths[this.paths.length - 1].add({
      x: event.center.x - this.canvasX,
      y: event.center.y - this.canvasY,
    });
  }

  private initCanvas() {
    this.project = new Project(this.signatureCanvas.nativeElement);
    this.canvasX = this.project.view.context.canvas.getBoundingClientRect().left;
    this.canvasY = this.project.view.context.canvas.getBoundingClientRect().top;

    this.paths.push(
      new Path({
        segments: [],
        strokeColor: '#fff',
        strokeWidth: 2,
      })
    );

    this.project.activeLayer.addChildren(this.paths);

    if (this.signature.value) {
      this.showSignature(this.signature.value);
    }
  }

  private showSignature(dataUri: string) {
    this.project.importSVG(dataUri);
  }

  private saveSignature() {
    const serializer = new XMLSerializer();
    const exportedSVG = this.project.exportSVG();
    const serializedSVG = serializer.serializeToString(exportedSVG);
    this.signature.setValue(serializedSVG);
    this.signature.markAsDirty();
  }
}
