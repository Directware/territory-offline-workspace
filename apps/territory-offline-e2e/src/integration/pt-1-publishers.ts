describe('VerkuendigerKomponente', () =>
{
  /* Vorlage
  it('', () =>
  {
  })
  */
  const publishersToBeAdded = [{
    firstName: 'Amadeus',
    name: 'Amadeus',
    email: 'amadaeus@amadeus.com',
    phone: '0821 821 821'
  },
  {
    firstName: 'Bertholt',
    name: 'Bertholt',
    email: 'bertholt@bertholt.com',
    phone: '0821 821 821'
  },
    {
      firstName: 'Cäsar',
      name: 'Cäsar',
      email: 'cäsar@cäsar.com',
      phone: '0821 821 821'
    }
  ];
  const alphabet = ['A', 'B', 'C'];

  it('Zwei Tags hinzufügen', () =>
  {
    cy.get('[data-cy=icon-tag]')
      .click()
    cy.get('[data-cy=button-edit]')
      .click()
    cy.get('[data-cy=input-tag-name]')
      .type('Getauft')
    cy.get('[data-cy=icon-add]')
      .click()
    cy.get('[data-cy=input-tag-name]')
      .type('Ungetauft')
    cy.get('[data-cy=icon-add]')
      .click()
    cy.get('[data-cy=button-finished]')
      .click()
  }
  )
  it('Verkündigerübersicht prüfen', () =>
  {
    cy.get('[data-cy=icon-users]')
      .click()
    cy.get('[data-cy=img-publisher]')
    cy.get('[data-cy=info-description]')
      .should('have.text', 'Erstelle oder importiere Verkündiger, um diesen Gebiete zuteilen zu können.')
    cy.get('[data-cy=info-header]')
      .should('have.text', 'Du hast noch keine Verkündiger!')
  })
  it('Neuen Verkündiger hinzufügen & Abbrechen', () =>
  {
    cy.get('[data-cy=button-add-publisher]')
      .click()
    cy.get('[data-cy=button-cancel]')
      .click()
  })
  it('Neue Verkündiger hinzufügen', () =>
  {
    publishersToBeAdded.forEach((publisher) =>
    {
      cy.get('[data-cy=button-add-publisher]')
        .click()
      cy.get('[data-cy=input-firstName]')
        .type(publisher.firstName)
      cy.get('[data-cy=input-name]')
        .type(publisher.name)
      cy.get('[data-cy=input-email]')
        .type(publisher.email)
      cy.get('[data-cy=input-phone]')
        .type(publisher.phone)
      cy.get('[data-cy=input-add-tag]')
        .type('ge')
      cy.get('[data-cy=search-result-tag]').first()
        .should('have.text', 'Getauft')
        .click()
      cy.get('[data-cy=button-save]')
        .click()
    })
  })
  it('Tag löschen', () =>
  {
    cy.get('[data-cy=button-add-publisher]')
      .click()

    cy.get('[data-cy=input-add-tag]')
      .type('ge')
    cy.get('[data-cy=search-result-tag]').first()
      .click()
    cy.get('[data-cy=icon-delete-tag]')
      .dblclick()
  })
  it('DSGVO-Überschrift,Text und Signature-Box vorhanden?', () =>
  {
    cy.get('[data-cy=dsgvo-info-header]')
      .should('have.text', 'DSGVO')
    cy.get('[data-cy=dsgvo-info-description]')
      .should('contain', 'Nach dem Lesen der Datenschutzerklärung kann hier eingewilligt werden. Bitte dazu in dem Kasten unterschreiben.')
    cy.get('[data-cy=dsgvo-canvas]')
      .should('be.visible')
    cy.get('[data-cy=button-cancel]')
      .click()
  })
  it('Verkündiger in Übersicht vorhanden?', () =>
  {
    const addedPublishers = cy.get('[data-cy=label-publisher-list]');
    addedPublishers.each((name, index) =>
    {
      cy.wrap(name).should('have.text', publishersToBeAdded[index].firstName + " " + publishersToBeAdded[index].name);
    })
  })
  it('Oberüberschriften in richtiger Reihenfolge vorhanden (A,B,C)?', () =>
  {
    const addedChars = cy.get('[data-cy=letter-publisher-list]');
    addedChars.each((char, index) =>
    {
      cy.wrap(char).should('have.text', alphabet[index]);
    })
  })
  it('Verkündiger suchen', () =>
  {
    // alphabet.forEach((char, index) =>
    // {
    //   cy.get('.input')
    //     .type(char)
    //     .wait(500)
    //   // console.log(publishersToBeAdded[index].firstName)
    //   cy.get('.main-wrapper > .label')
    //     .should('contain', publishersToBeAdded[index].firstName)
    //     .and('contain', publishersToBeAdded[index].name)
    //   cy.get('.input')
    //     .clear()
    // })
    cy.get('[data-cy=input-search]')
      .type('R')
      .wait(500)
    cy.get('[data-cy=label-publisher-list]').eq(0)
      .should('have.text', publishersToBeAdded[1].firstName + " " + publishersToBeAdded[1].name)
      .and('not.contain', publishersToBeAdded[0].firstName)
    cy.get('[data-cy=label-publisher-list]').eq(1)
      .should('have.text', publishersToBeAdded[2].firstName + " " + publishersToBeAdded[2].name)
      .and('not.contain', publishersToBeAdded[0].firstName)
    cy.get('[data-cy=input-search]')
      .clear()
  })
  it('Tags "Getauft" & "Ungetauft" wieder löschen', () =>
  {
    cy.get('[data-cy=icon-tag]')
      .click()
    cy.get('[data-cy=button-edit]')
      .click()
    cy.get('[data-cy=icon-trash]')
      .dblclick()
    cy.get('[data-cy=button-finished]')
      .click()
  })
})
