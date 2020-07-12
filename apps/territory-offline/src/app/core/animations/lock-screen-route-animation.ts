import { animate, query, style, transition, trigger } from '@angular/animations';

export const lockScreenAnimations = trigger('routeAnimations', [
    transition('LockScreen => *', [
        query(
            ':enter',
            [style({ top: "-100vh" })],
            { optional: true }
        ),
        query(
            ':leave',
            [style({ top: 0 }), animate('.5s ease-out', style({ top: "-100vh" }))],
            { optional: true }
        )
    ]),
    transition('* => LockScreen', [
        query(
            ':enter',
            [style({ top: "-100vh" })],
            { optional: true }
        ),
        query(
            ':enter',
            [style({ top: "-100vh" }), animate('.5s ease-out', style({ top: 0 }))],
            { optional: true }
        )
    ])
]);
