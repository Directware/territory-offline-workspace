describe('TagKomponente', () =>
{
  // it('Passwort eingeben (Lock-Screen)', () =>
  // {
  //   cy.get('.input-wrapper input[name="password"]')
  //     .type('password')
  //     .should('have.value', 'password')
  //     .should('not.have.value', 'blablabla')
  //   cy.get('i-feather[name="arrow-right-circle"]')
  //     .click()
  // }
  // )
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
      .type('ATag')
      .should('have.value', 'ATag')
      .should('not.have.value', 'blablabla')
    cy.get('i-feather[name="plus"]')
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
  //TODO elemente sortieren --> array vergleichen (elemente bereits in array wie einzelen auswählen?)
  // it('Reihenfolge prüfen', () =>
  // {
  //   let sortedTagsArray = ['ATag']
  //   cy.expect(cy.get('p.label').invoke('text')).to.eq(sortedTagsArray)
  // }
  // )
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
      .should('not.contain', 'blabla')
    cy.get('.search-wrapper input')
      .clear()
  }
  )
  it('Duplikat vorhanden?', () =>
  {
    cy.get('.action-link')
      .click()
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('ATag')
    cy.get('i-feather[name="plus"]')
      .click()
    cy.on('window:alert', (alertText) =>
    {
      expect(alertText).to.contain('existiert bereits')
      expect(alertText).not.to.contain('blabla')
    })
    cy.get('.action-link')
      .click()
  }
  )
  it('Alle Tags löschen', () =>
  {
    cy.get('.action-link')
      .click()
    cy.get('i-feather[name = "trash"]').first()
      .click()
    cy.get('i-feather[name = "trash"]').first()
      .click()
    cy.get('i-feather[name = "trash"]').first()
      .click()
    cy.get('.action-link')
      .click()
  }
  )
})
