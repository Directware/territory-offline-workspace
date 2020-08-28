describe('TagKomponente', () =>
{
  const tagsToBeAdded = ["A-Tag", "B-Tag", "C-Tag"];
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

    tagsToBeAdded.forEach(tag =>
    {
      cy.get('input[placeholder="Tag hinzufügen"]')
        .type(tag)
        .should('have.value', tag)
      cy.get('i-feather[name="plus"]')
        .click()
    })

    cy.get('.action-link')
      .click()
  }
  )
  it('Reihenfolge prüfen', () =>
  {
    const addedTags = cy.get(".label");
    addedTags.each((htmlTag, index) =>
    {
      // console.log(htmlTag.text())
      // console.log(index.toExponential())
      expect(htmlTag.text()).to.include(tagsToBeAdded[index]);
    });
  })
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
      .type('A')
    cy.get('p.label')
      .should('contain', 'A-Tag')
    cy.get('.search-wrapper input')
      .clear()
  }
  )
  it('Duplikat vorhanden?', () =>
  {
    cy.get('.action-link')
      .click()
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('A-Tag')
    cy.get('i-feather[name="plus"]')
      .click()
    cy.on('window:alert', (alertText) =>
    {
      expect(alertText).to.contain('existiert bereits')
    })
    cy.get('.action-link')
      .click()
  }
  )
  it('Alle Tags löschen', () =>
  {
    cy.get('.action-link')
      .click()
    tagsToBeAdded.forEach(() =>
    {
      cy.get('i-feather[name = "trash"]').first()
        .click()
    })
    cy.get('.action-link')
      .click()
  }
  )
})
