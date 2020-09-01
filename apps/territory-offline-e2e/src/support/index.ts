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

export const congregation = 'Augsburg LM'

before(() =>
{
  indexedDB.deleteDatabase('territory-offlineIDB')
  cy.visit('/territories')
// 'Eingabe Name-Versammlungsgebiet'
  cy.get('.password-wrapper input').first()
    .clear()
    .type(congregation)
// 'Eingabe/Auswahl Sprache'
  const languageInput = '.password-wrapper input[name="language"]'
  cy.get(languageInput)
    .type('de')
  cy.get('app-language-search app-list-item').first()
    .click()
// 'Eingabe Passwort'
  cy.get('.password-wrapper input[id="new-password-text-field"]')
    .clear()
    .type('password')
  cy.get('.password-wrapper input[id="confirm-password-text-field"]')
    .clear()
    .type('password')
// 'Button Weiter'
  cy.get('.main-button').first() //Klasse gibt immer eine Liste zurück, deswegen Auswahl mit first(), auch wenn es nur einen Button gibt
    .click()
// 'Button Landkarte ausrichten anklicken'
  cy.get('div.button')
    .click()
}
)
