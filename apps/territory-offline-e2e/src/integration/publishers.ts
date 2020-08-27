describe('VerkuendigerKomponente', () =>
{
  /* Vorlage
  it('', () =>
  {
  })
  */
  it('Zwei Tags hinzufügen', () =>
  {
    cy.get('i-feather[name="tag"]')
      .click()
    cy.get('.action-link')
      .click()
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('Getauft')
    cy.get('i-feather[name="plus"]')
      .click()
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('Ungetauft')
    cy.get('i-feather[name="plus"]')
      .click()
    cy.get('.action-link')
      .click()
  }
  )
  it('Rufe Verkündigerübersicht auf', () =>
  {
    cy.get('i-feather[name="users"]')
      .click()
  })
  it('Neuen Verkündiger hinzufügen & Abbrechen', () =>
  {
    cy.get('.action-link')
      .click()
    cy.get('.cancel')
      .click()
  })
  it('Neuen Verkündiger hinzufügen', () =>
  {
    cy.get('.action-link')
      .click()
    cy.get('.main-wrapper input[name="firstName"]')
      .type('Luca')
    cy.get('.main-wrapper input[name="name"]')
      .type('Morreale')
    cy.get('.main-wrapper input[name="email"]')
      .type('test@gmail.com')
    cy.get('.main-wrapper input[name="phone"]')
      .type('0821 821 821')
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('ge')
    cy.get('.label').first()
      .should('contain', 'Getauft')
      .click()
  })
  it('Tag löschen und wieder zuweisen', () =>
  {
    cy.get('i-feather[name="trash"]')
      .dblclick()
    cy.get('.label').first()
      .should('contain', '')
    cy.get('.label').first()
      .should('contain', 'Getauft')
      .click()
  })
  it('DSGVO-Überschrift,Text und Signature-Box vorhanden?', () =>
  {
    cy.get('h4.h4-white')
      .should('contain', 'DSGVO')
    cy.get('p.body-grey')
      .should('contain', 'Nach dem Lesen der Datenschutzerklärung kann hier eingewilligt werden. Bitte dazu in dem Kasten unterschreiben.')
    cy.get('canvas[id="dsgvo-signature"]')
      .should('be.visible')
  })
  it('Neuen Verkündiger speichern', () =>
  {
    cy.get('.save')
      .click()
  })








})
