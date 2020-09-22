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
  it('Verkündigerübersicht prüfen', () =>
  {
    cy.get('i-feather[name="users"]')
      .click()
    cy.get('img')
    cy.get('p')
      .should('contain', 'Erstelle oder importiere Verkündiger, um diesen Gebiete zuteilen zu können.')
    cy.get('h4')
      .should('contain', 'Du hast noch keine Verkündiger!')
  })
  it('Neuen Verkündiger hinzufügen & Abbrechen', () =>
  {
    cy.get('.action-link')
      .click()
    cy.get('.cancel')
      .click()
  })
  it('Neue Verkündiger hinzufügen', () =>
  {
    publishersToBeAdded.forEach((publisher) =>
    {
      cy.get('.action-link')
        .click()
      cy.get('.main-wrapper input[name="firstName"]')
        .type(publisher.firstName)
      cy.get('.main-wrapper input[name="name"]')
        .type(publisher.name)
      cy.get('.main-wrapper input[name="email"]')
        .type(publisher.email)
      cy.get('.main-wrapper input[name="phone"]')
        .type(publisher.phone)
       cy.get('input[placeholder="Tag hinzufügen"]')
        .type('ge')
      cy.get('.search-result > .main-wrapper > .label').first()
        .should('contain', 'Getauft')
        .click()
      cy.get('.save')
        .click()
    })
  })
  it('Tag löschen', () =>
  {
    cy.get('.action-link')
      .click()
    // cy.get('.main-wrapper input[name="firstName"]')
    //   .type(publishersToBeAdded[0].firstName)
    // cy.get('.main-wrapper input[name="name"]')
    //   .type(publishersToBeAdded[0].name)
    // cy.get('.main-wrapper input[name="email"]')
    //   .type(publishersToBeAdded[0].email)
    // cy.get('.main-wrapper input[name="phone"]')
    //   .type(publishersToBeAdded[0].phone)
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('ge')
    cy.get('.search-result > .main-wrapper > .label').first()
      .click()
    cy.get('i-feather[name="trash"]')
      .dblclick()
  })
  it('DSGVO-Überschrift,Text und Signature-Box vorhanden?', () =>
  {
    cy.get('h4.h4-white')
      .should('contain', 'DSGVO')
    cy.get('p.body-grey')
      .should('contain', 'Nach dem Lesen der Datenschutzerklärung kann hier eingewilligt werden. Bitte dazu in dem Kasten unterschreiben.')
    cy.get('canvas[id="dsgvo-signature"]')
      .should('be.visible')
    cy.get('.cancel')
      .click()
  })
  it('Verkündiger in Übersicht vorhanden?', () =>
  {
    const addedPublishers = cy.get('.main-wrapper > .label');
    addedPublishers.each((name, index) =>
    {
      expect(name.text()).to.include(publishersToBeAdded[index].firstName);
      expect(name.text()).to.include(publishersToBeAdded[index].name);
    })
  })
  it('Oberüberschriften in richtiger Reihenfolge vorhanden (A,B,C)?', () =>
  {
    const addedChars = cy.get('h2.h2-white');
    addedChars.each((char, index) =>
    {
      expect(char.text()).to.include(alphabet[index]);
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
    cy.get('.input')
        .type('R')
    cy.get('.main-wrapper > .label')
      .should('contain', publishersToBeAdded[1].firstName)
      .and('contain', publishersToBeAdded[2].firstName)
      .and('not.contain', publishersToBeAdded[0].firstName)
    cy.get('.input')
      .clear()
  })
  it('Tags "Getauft" & "Ungetauft" wieder löschen', () =>
  {
    cy.get('i-feather[name="tag"]')
      .click()
    cy.get('.action-link')
      .click()
    cy.get('div.action > .action > .feather')
      .dblclick()
    cy.get('.action-link')
      .click()
  })
})
