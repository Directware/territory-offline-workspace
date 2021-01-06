// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

before(() =>
{
  indexedDB.deleteDatabase('field-companionIDB')
  cy.visit("/");
  cy.url()
    .should('include', 'welcome')
  cy.get('[data-cy=button-continue-welcome]')
    .click()
  cy.url()
    .should('include', 'field-service')
  cy.get('[data-cy=button-confirm-new-feature-territory]')
    .click()
  cy.get('[data-cy=button-confirm-new-feature-report-minute]')
    .click()
})


