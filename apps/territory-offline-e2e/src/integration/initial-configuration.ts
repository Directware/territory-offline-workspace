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
})
