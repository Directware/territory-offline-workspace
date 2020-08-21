describe('InitialeKonfiguration', () =>
{
  it('Beim ersten Start der App muss immer InitialConfiguration geöffnet werden', () =>
  {
    cy.visit('/territories')
      .wait(500) //TODO do it better
      .url().should('contain', 'initial')
      .url().should('not.contain', 'territories')
  }
  )
  it('Eingabe Name-Versammlungsgebiet', () =>
  {
    cy.get('.password-wrapper input').first()
      .clear()
      .type('Augsburg LM')
      .should('have.value', 'Augsburg LM')
  }
  )
  it('Eingabe/Auswahl Sprache', () =>
  {
    const languageInput = '.password-wrapper input[name="language"]'
    cy.get(languageInput)
      .type('de')
    cy.get('app-language-search app-list-item').first()
      .click()
    cy.get(languageInput)
      .should('have.value', 'Deutsch')
  }
  )
  it('Eingabe Passwort', () =>
  {
    cy.get('.password-wrapper input[id="new-password-text-field"]')
      .clear()
      .type('password')
      .should('have.value', 'password')
      .should('not.have.value', 'blablabla')
  }
  )
  it('Eingabe Passwort wiederholen', () =>
  {
    cy.get('.password-wrapper input[id="confirm-password-text-field"]')
      .clear()
      .type('password')
      .should('have.value', 'password')
      .should('not.have.value', 'blablabla')
  }
  )
  it('Button Weiter', () =>
  {
    cy.get('.main-button').first() //Klasse gibt immer eine Liste zurück, deswegen Auswahl mit first(), auch wenn es nur einen Button gibt
      .click()
  }
  )
  it('Button Landkarte ausrichten anklicken', () =>
  {
    cy.get('div.button')
      .click()
    cy.url().should('contain', 'dashboard')
  }
  )
})
