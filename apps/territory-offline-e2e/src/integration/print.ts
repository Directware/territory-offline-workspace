


describe('InitialeKonfiguration', () =>
{
  it('Beim ersten Start der App muss immer InitialConfiguration geöffnet werden', () =>
  {
    cy.visit('/territories')
    cy.wait(4000)
    cy.get('[name="layers"] > .feather')
      .click()
    cy.get('.input')
      .type('Stadtbergen')
    cy.wait(1000)

    cy.get('.main-wrapper > .label').first().then((innerText) =>
    {
      let territoryName = innerText.text()

      territoryName = territoryName.replace(' ', '');
      cy.get('.main-wrapper > .label').first().click()
      cy.get(':nth-child(5) > :nth-child(1) > .main-wrapper > .label').click()
      cy.get('.card-format-TerritoryCardFormat\\.a6 > .main-wrapper > .label').click()
      cy.get('.preferences.ng-star-inserted > .wrapper > :nth-child(2) > .main-wrapper > .label').click()
      cy.get('.preferences.ng-star-inserted > .wrapper > :nth-child(3) > .main-wrapper > .label').click()

      cy.get('.wrapper > :nth-child(4) > .main-wrapper > .label').click()
      cy.get('.wrapper > :nth-child(5) > .main-wrapper > .label').click()
      cy.exec(`screencapture -x -R1240,405,500,355 /Users/lumo/Desktop/Screenshots/Gebiete/${territoryName}.png`)
    })


    for (let i = 2; i < 129; i++)
    {
      cy.get('app-list.ng-star-inserted').children().eq(i).click()

      cy.get('app-list.ng-star-inserted').children().eq(i).then((innerText) =>
      {
        let territoryName = innerText.text()

        territoryName = territoryName.replace(' ', '');

      cy.wait(500)
      cy.get(':nth-child(5) > :nth-child(1) > .main-wrapper > .label').click()
      cy.wait(1000)
      cy.exec(`screencapture -x -R1240,405,500,355 /Users/lumo/Desktop/Screenshots/Gebiete/${territoryName}.png`)
      })
    }




  }
  )
})
