import {
  transition,
  trigger,
  query,
  style,
  animate,
  group
} from '@angular/animations';

const slideFromLeftToRight = [
  query(':enter, :leave',
    style({position: 'fixed', width: '100%'}),
    {optional: true}),
  group([
    query(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate('0.25s ease-in-out',
        style({transform: 'translateX(0%)'}))
    ], {optional: true}),
    query(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.25s ease-in-out',
        style({transform: 'translateX(100%)'}))
    ], {optional: true}),
  ])
];

const slideFromRightToLeft = [
  query(':enter, :leave',
    style({position: 'fixed', width: '100%'}),
    {optional: true}),
  group([
    query(':enter', [
      style({transform: 'translateX(100%)'}),
      animate('0.25s ease-in-out',
        style({transform: 'translateX(0%)'}))
    ], {optional: true}),
    query(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.25s ease-in-out',
        style({transform: 'translateX(-100%)'}))
    ], {optional: true}),
  ])
];

const modalSlideUpTransition = [
  query(':enter, :leave',
    style({position: 'fixed', width: '100%'}),
    {optional: true}),
  group([
    query(':enter', [
      style({transform: 'translateY(100%)'}),
      animate('0.25s ease-in-out',
        style({transform: 'translateY(0%)'}))
    ], {optional: true}),
    query(':leave', [
      style({}),
      animate('0.25s ease-in-out',
        style({}))
    ], {optional: true}),
  ])
];
const modalSlideDownTransition = [
  query(':enter, :leave',
    style({position: 'fixed', width: '100%'}),
    {optional: true}),
  group([
    query(':leave', [
      style({transform: 'translateY(0)', zIndex: 100}),
      animate('0.25s ease-in-out',
        style({transform: 'translateY(100%)'}))
    ], {optional: true}),
    query(':enter', [
      style({zIndex: 10}),
      animate('0.25s ease-in-out',
        style({}))
    ], {optional: true}),
  ])
];

export const slideInAnimation =
  trigger('routeAnimations', [
    // transition('Settings => Territories', slideFromLeftToRight),
    // transition('Settings => Time', slideFromLeftToRight),

    transition('Welcome => Time', slideFromRightToLeft),

    transition('Settings => Modal', modalSlideUpTransition),
    transition('Modal => Settings', modalSlideDownTransition),

    transition('Territories => Modal', modalSlideUpTransition),
    transition('Modal => Territories', modalSlideDownTransition),

    transition('Time => Modal', modalSlideUpTransition),
    transition('Modal => Time', modalSlideDownTransition),

    // transition('Territories => Settings', slideFromRightToLeft),
    // transition('Territories => Time', slideFromRightToLeft),

    // transition('Time => Settings', slideFromRightToLeft),
    // transition('Time => Territories', slideFromLeftToRight),

    transition('Modal => EditReport', slideFromRightToLeft),
    transition('EditReport => Modal', slideFromLeftToRight),

    transition('Modal => ChooseMonth', slideFromRightToLeft),
    transition('ChooseMonth => Modal', slideFromLeftToRight),
  ]);
