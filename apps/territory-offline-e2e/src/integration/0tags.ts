describe('TagKomponente', () => {
  const tagsToBeAdded = ['A-Tag', 'B-Tag', 'C-Tag'];
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

  before('Rufe Tagübersicht auf', () => {
    // @ts-ignore
    cy.configureApp();

    // @ts-ignore
    cy.navigate('/dashboard');

    cy.get('[data-cy=icon-menu-tags]').click();
  });
  it('Drei Tags hinzufügen', () => {
    cy.get('[data-cy=button-edit]').click();

    tagsToBeAdded.forEach((tag) => {
      cy.get('[data-cy=input-tag-name]').type(tag).should('have.value', tag);
      cy.get('[data-cy=icon-add]').click();
    });

    cy.get('[data-cy=button-finished]').click();
  });
  it('Reihenfolge prüfen', () => {
    cy.get('[data-cy=label-tag]').each((htmlTag, index) => {
      cy.wrap(htmlTag.text()).should('include', tagsToBeAdded[index]);
    });
  });
  it('Tag bearbeiten', () => {
    cy.get('[data-cy=button-edit]').click();
    cy.get('[data-cy=color-picker]').first().click();
    cy.get('div.saturation-lightness').click(50, 50);
    cy.get('div.hue').click(40, 0);
    cy.get('.hex-text .box input').should('have.value', '#859c7a');
    //TODO durchsichtigkeit der farbe ändern und prüfen
    cy.get('[data-cy=button-finished]').click();
  });
  it('Tag suchen', () => {
    cy.get('[data-cy=input-search]').click().type('A');
    cy.get('[data-cy=label-tag]').first().should('contain', 'A-Tag');
    cy.get('[data-cy=input-search]').clear();
  });
  it('Duplikat vorhanden?', () => {
    cy.get('[data-cy=button-edit]').click();
    cy.get('[data-cy=input-tag-name]').type('A-Tag');
    cy.get('[data-cy=icon-add]').click();
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.contain('existiert bereits');
    });
    cy.get('[data-cy=button-finished]').click();
  });
  it('Alle Tags löschen', () => {
    cy.get('[data-cy=button-edit]').click();
    tagsToBeAdded.forEach(() => {
      cy.get('[data-cy=icon-trash]').first().click();
    });
    cy.get('[data-cy=button-finished]').click();
  });
});
