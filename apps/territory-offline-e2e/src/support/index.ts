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
  indexedDB.deleteDatabase('territory-offlineIDB')
  cy.visit('/territories')
// 'Eingabe Name-Versammlungsgebiet'
  cy.get('[data-cy=input-congregation-name]')
    .clear()
    .type('Augsburg LM')
// 'Eingabe/Auswahl Sprache'
  const languageInput = '[data-cy=input-language]'
  cy.get(languageInput)
    .type('de')
  cy.get('[data-cy=select-language]')
    .click()
// 'Eingabe Passwort'
  cy.get('[data-cy=input-password]')
    .clear()
    .type('password')
  cy.get('[data-cy=input-password-confirm]')
    .clear()
    .type('password')
// 'Button Weiter'
  cy.get('[data-cy=button-next]')
    .click()
// 'Button Landkarte ausrichten anklicken'
  cy.wait(2000)
  cy.get('[data-cy=button-choose-origin]')
    .click()
}
)
