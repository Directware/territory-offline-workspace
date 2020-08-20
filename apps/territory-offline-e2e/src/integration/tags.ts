describe('TagKomponente', () =>
{
  it('Rufe Komponente Tag auf', () =>
  {
    cy.visit('/dashboard')
    cy.get('i-feather[name="tag"]')
      .click()
  }
  )
})
