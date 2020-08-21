describe('TagKomponente', () =>
{
  it('Startseite öffnen', () =>
  {
    cy.visit('/dashboard')
  }
  )
  it('Passwort eingeben (Lock-Screen)', () =>
  {
    cy.get('.input-wrapper input[name="password"]')
      .type('password')
      .should('have.value', 'password')
      .should('not.have.value', 'blablabla')
    cy.get('i-feather[name="arrow-right-circle"]')
      .click()
  }
  )
  it('Rufe Tagübersicht auf', () =>
  {
    cy.get('i-feather[name="tag"]')
      .click()
  }
  )
  it('Drei Tags hinzufügen', () =>
  {
    cy.get('.action-link')
      .click()
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('NewTag')
      .should('have.value', 'NewTag')
      .should('not.have.value', 'blablabla')
    cy.get('i-feather[name="plus"')
      .click()
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('TestTag')
      .should('have.value', 'TestTag')
      .should('not.have.value', 'blablabla')
    cy.get('i-feather[name="plus"]')
      .click()
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('Tennis')
      .should('have.value', 'Tennis')
      .should('not.have.value', 'blablabla')
    cy.get('i-feather[name="plus"]')
      .click()
    cy.get('.action-link')
      .click()
  }
  )
  it('Tag bearbeiten', () =>
  {
    cy.get('.action-link')
      .click()
    cy.get('input.color-picker').first()
      .click()
    cy.get('div.saturation-lightness')
      .click('topRight')
    //TODO klären wie genaue pixelangabe funktioniert
    cy.get('div.hue')
      .click('center')
    cy.get('.hex-text .box input')
      .should('have.value', '#01fefe')
      .should('not.have.value', '#fe0101')
    //TODO durchsichtigkeit der farbe ändern und prüfen
    cy.get('.action-link')
      .click()
  }
  )
  it('Tag suchen', () =>
  {
    cy.get('.search-wrapper input')
      .type('Te')
    cy.get('p.label')
      .should('contain', 'Te')
  }
  )
})
