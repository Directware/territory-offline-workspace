function territorySelection()
{
  cy.get('.mapbox-gl-draw_polygon')
    .click()
  cy.get('.mapboxgl-canvas')
    .click('center')
    .click('right')
    .click('topRight')
    .click('top')
    .click('center')
}

describe('GebietsKomponente', () =>
{
  const streetsToBeAdded = ['Metzstraße', 'Neuburgerstraße']

  const territoriesToBeAdded = [{
    number: '1',
    place: 'Pfersee',
    units:  '20',
    commentary: 'Das ist ein Test-Kommentar',
    streets: streetsToBeAdded,
  },
  {
    number: '2',
    place: 'Haunstetten',
    units: '30',
    commentary: 'Das ist ein Test-Kommentar',
    streets: streetsToBeAdded,
  },
  {
    number: '3',
    place: 'Göggingen',
    units: '10',
    commentary: 'Das ist ein Test-Kommentar',
    streets: streetsToBeAdded,
  }]

  it('Zwei Tags hinzufügen', () =>
  {
    cy.get('i-feather[name="tag"]')
      .click()
    cy.get('.action-link')
      .click()
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('Dienstwoche')
    cy.get('i-feather[name="plus"]')
      .click()
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type('Pioniere')
    cy.get('i-feather[name="plus"]')
      .click()
    cy.get('.action-link')
      .click()
  }
  )
  it('Gebietsübersicht aufrufen und auf "+Neues Gebiet klicken"', () =>
  {
    cy.get('[name="layers"] > .feather')
      .wait(1000)
      .click()
    cy.get('.action-link')
      .click()
  })
  it('1."Speichern-Button" erst dann klickbar wenn Gebietszahl, -ort, -bereich angegeben \n 2.Gebietsauswahl wieder löschen \n 3.Gebiet hinzufügen Abbrechen', () =>
  {
    cy.get('.save.not-valid')
    cy.get('input[placeholder="Nummer*"]')
      .type('1')
    cy.get('input[placeholder = "Ort*"]')
      .type('Pfersee')
    territorySelection()
    cy.get('.mapbox-gl-draw_trash')
      .click()
    territorySelection()
    cy.get('.save')
    cy.get('.cancel')
      .click()
  })
  it('Gebiete hinzufügen', () =>
  {
    let yTop = 100
    let yBottom = 120

    territoriesToBeAdded.forEach((territory) => {
      cy.get('.action-link')
        .click()
      cy.get('input[placeholder="Nummer*"')
        .type(territory.number)
      cy.get('input[placeholder="Ort*"')
        .type(territory.place)
      cy.get('input[placeholder="Wohneinheiten"')
        .clear()
        .type(territory.units)
      cy.get('textarea[placeholder="Kommentar"')
        .type(territory.commentary)
      streetsToBeAdded.forEach((street) =>
      {
        cy.get('input[placeholder="Straße hinzufügen"')
          .type(street)
        cy.get('.wrapper.boundary-names i-feather[name="plus"]')
          .click()
      })
      cy.get('input[placeholder="Tag hinzufügen"')
        .clear()
        .type('Dienstwoche')
      cy.get('.search-result i-feather[name="plus"]')
        .click()
      //Gebietsbereiche auf Karte auswählen
      cy.get('.mapbox-gl-draw_polygon')
        .click()
      cy.get('.mapboxgl-canvas')
        .click(800, yTop)
        .click(850, yTop)
        .click(850, yBottom)
        .click(800, yBottom)
        .click(800, yTop)
      cy.get('.save')
        .click()
      yTop = yTop + 40
      yBottom = yBottom + 40

    })
  })
})
