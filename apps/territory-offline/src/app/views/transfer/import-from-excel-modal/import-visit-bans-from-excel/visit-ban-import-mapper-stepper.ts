import { MatStepper } from '@angular/material/stepper';

export class VisitBanImportMapperStepper {
  private _matStepper: MatStepper;

  constructor(matStepper: MatStepper) {
    this._matStepper = matStepper;
  }

  public nextStep() {
    this._matStepper.next();
  }

  public currentStep(): number {
    return this._matStepper.selectedIndex;
  }

  public isLastStep(): boolean {
    return this._matStepper.selectedIndex === this._matStepper.steps.length - 1;
  }
}
