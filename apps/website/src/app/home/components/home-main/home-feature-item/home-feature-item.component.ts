import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations'

@Component({
    selector: 'app-home-feature-item',
    templateUrl: './home-feature-item.component.html',
    styleUrls: ['./home-feature-item.component.scss'],
    animations: [
        trigger(
            'open',
            [
                transition(
                    ':enter', [
                        style({ maxHeight: 0, opacity: 0}),
                        animate('300ms ease-out', style({ maxHeight: '300px', opacity: 1}))
                    ]
                ),
                transition(
                    ':leave', [
                        style({ maxHeight: '300px', opacity: 1}),
                        animate('300ms ease-out', style({ maxHeight: 0, opacity: 0}))
                    ]
                )
            ]
        )
    ],
})
export class HomeFeatureItemComponent implements OnInit {

    @Input() public feature: string;
    @Output() public activate = new EventEmitter<boolean>();
    @Output() public deactivate = new EventEmitter<boolean>();
    @HostBinding('class.flip') @Input() public active = false;

    constructor() { }

    public ngOnInit() {
    }

    public open() {
        this.activate.emit(true);
        this.activate.emit(false);
    }

    public close() {
        this.deactivate.emit(true);
        this.deactivate.emit(false);
    }
}
