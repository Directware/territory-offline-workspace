import { getGreeting } from '../support/app.po';

describe('website', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file

    cy.get(".territory-offline.title").should("be.visible");
    cy.get(".territory-offline.title").should("have.text", "Territory Offline");

  });
});
