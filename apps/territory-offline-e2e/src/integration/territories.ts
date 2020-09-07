import { congregation } from '../support/index';
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
const streetsToBeAdded = ['Metzstraße', 'Neuburgerstraße']

const territoriesToBeAdded = [{
  number: '1',
  place: 'Pfersee',
  units: '20',
  commentary: 'Das ist ein Test-Kommentar',
  streets: streetsToBeAdded,
},
{
  number: '2',
  place: 'Haunstetten-Nord',
  units: '30',
  commentary: 'Das ist ein Test-Kommentar',
  streets: streetsToBeAdded,
  }]

  const tagToBeAdded = 'Dienstwoche'

describe('GebietsKomponente', () =>
{
  it('Tag hinzufügen', () =>
  {
    cy.get('i-feather[name="tag"]')
      .click()
    cy.get('.action-link')
      .click()
    cy.get('input[placeholder="Tag hinzufügen"]')
      .type(tagToBeAdded)
    cy.get('i-feather[name="plus"]')
      .click()
    cy.get('.action-link')
      .click()
  })
  it('Gebietsübersicht aufrufen und auf "+Neues Gebiet klicken"', () =>
  {
    cy.get('[name="layers"] > .feather')
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
    let yBottom = 160

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
        .click(900, yTop)
        .click(900, yBottom)
        .click(800, yBottom)
        .click(800, yTop)
      cy.get('.save')
        .click()
      yTop = yTop + 60
      yBottom = yBottom + 60
    })
  })
  it('Gebietsübersicht prüfen: \n Vollständigkeit & Reihenfolge hinzugefügter Gebiete', () =>
  {
    const addedTerritories = cy.get('.main-wrapper > .label');
    addedTerritories.each((name, index) =>
    {
      expect(name.text()).to.include(territoriesToBeAdded[index].number)
      expect(name.text()).to.include(territoriesToBeAdded[index].place)
    })
  })
  it('Gebietsübersicht prüfen: \n Versammlungsname und Filter vorhanden', () =>
  {
    cy.get('.h2-white')
      .should('contain', congregation)
    cy.get('.blue')
      .should('contain', 'In Bearbeitung')
    cy.get('.green')
      .should('contain', 'Bearbeitet')
    cy.get('.yellow')
      .should('contain', 'Neu zuteilen')
    cy.get('.red')
      .should('contain', 'Zuteilung fällig')
    cy.get('.h4-white')
      .should('contain', 'Filter')
  })
  it('Gebiet suchen und bei einzigem Ergebnis ', () =>
  {
    cy.get('.input')
      .type('P')
    cy.get('.info')
      .should('contain', 'Pfersee')
    cy.get('.back')
      .click()
    cy.get('.input')
      .clear()
  })
  it('Gebiet suchen und bei mehreren Ergebnissen anzeigen', () =>
  {
    cy.get('.input')
      .type('Ha')
    cy.get('.main-wrapper > .label')
      .should('contain', territoriesToBeAdded[1].place)
    cy.get('.back')
      .click()
    cy.get('.input')
      .clear()
  })
  it('Gebiet auf Karte anklicken \n Felder prüfen', () =>
  {
    cy.get('.mapboxgl-canvas')
      .click('center')
    cy.get(':nth-child(2) > :nth-child(1) > .main-wrapper > .label')
      .should('contain', 'Ort')
    cy.get(':nth-child(2) > :nth-child(1) > div.info > .info')
      .should('contain', territoriesToBeAdded[1].place)
    cy.get(':nth-child(2) > :nth-child(2) > .main-wrapper > .label')
      .should('contain', 'Nummer')
    cy.get(':nth-child(2) > div.info > .info')
      .should('contain', territoriesToBeAdded[1].number)
    cy.get(':nth-child(3) > :nth-child(1) > .main-wrapper > .label')
      .should('contain', 'Wohneinheiten')
    cy.get(':nth-child(3) > :nth-child(1) > div.info > .info')
      .should('contain', territoriesToBeAdded[1].units)
    cy.get(':nth-child(3) > :nth-child(2) > .main-wrapper > .label')
      .should('contain', 'Kommentar')
    cy.get('.comment')
      .should('contain', territoriesToBeAdded[1].commentary)
    cy.get('.h3-white')
      .should('contain', 'Tags')
    cy.get('app-tags-preview')
      .should('contain', tagToBeAdded)
    cy.get(':nth-child(5) > app-list-item > .main-wrapper > .label')
      .should('contain', 'Gebietskarte drucken')
    cy.get(':nth-child(6) > :nth-child(1) > .main-wrapper > .label')
      .should('contain', 'Zuteilungen')
    cy.get(':nth-child(6) > :nth-child(2) > .main-wrapper > .label')
      .should('contain', 'Nicht besuchen Adressen')
  })
  // TODO Code einfacher machen
  it('Gebietskarte drucken', () =>
  {
    cy.get('app-list-item > .main-wrapper > .label.blue')
      .click()

  })
})
