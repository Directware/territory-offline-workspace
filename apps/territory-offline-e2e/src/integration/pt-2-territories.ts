// import { congregation } from '../support/index';

import { utc } from "moment";

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
};


const streetsToBeAdded = ['Metzstraße', 'Neuburgerstraße'];

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
}];

const tagToBeAdded = 'Dienstwoche';

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
];

const date = new Date();
const currDate = ('0' + date.getDate()).slice(-2) + '.'
              + ('0' + (date.getMonth() + 1)).slice(-2) + '.'
              + date.getFullYear();

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

  it('Verkündiger hinzufügen', () =>
  {
    cy.get('i-feather[name="users"]')
      .click()
      cy.get('.action-link')
        .click()
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
      cy.get('.save')
        .click()
    })
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
      cy.get('input[placeholder="Nummer*"]')
        .type(territory.number)
      cy.get('input[placeholder="Ort*"]')
        .type(territory.place)
      cy.get('input[placeholder="Wohneinheiten"]')
        .clear()
        .type(territory.units)
      cy.get('textarea[placeholder="Kommentar"]')
        .type(territory.commentary)
      streetsToBeAdded.forEach((street) =>
      {
        cy.get('input[placeholder="Straße hinzufügen"]')
          .type(street)
        cy.get('.wrapper.boundary-names i-feather[name="plus"]')
          .click()
      })
      cy.get('input[placeholder="Tag hinzufügen"]')
        .clear()
        .type('Dienstwoche')
      cy.get('.search-result i-feather[name="plus"]')
        .click()
      //Gebietsbereiche auf Karte auswählen
      cy.get('.mapbox-gl-draw_polygon')
        .click()
      cy.get('.mapboxgl-canvas')
        .click(1000, yTop)
        .click(1100, yTop)
        .click(1100, yBottom)
        .click(1000, yBottom)
        .click(1000, yTop)
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
      .should('contain', 'Augsburg LM')
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


  xit('Gebiet auf Karte anklicken \n Felder prüfen', () =>
  {
    cy.get('.mapboxgl-canvas')
      .click(1000,100)
    cy.get('.label.location')
      .should('contain', 'Ort')
    cy.get('.info.location')
      .should('contain', territoriesToBeAdded[1].place)
    cy.get('.label.number')
      .should('contain', 'Nummer')
    cy.get('.info.number')
      .should('contain', territoriesToBeAdded[1].number)
    cy.get('.label.units')
      .should('contain', 'Wohneinheiten')
    cy.get('.info.units')
      .should('contain', territoriesToBeAdded[1].units)
    cy.get('.label.comment')
      .should('contain', 'Kommentar')
    cy.get('.info.comment')
      .should('contain', territoriesToBeAdded[1].commentary)
    cy.get('.h3-white')
      .should('contain', 'Tags')
    cy.get('app-tags-preview')
      .should('contain', tagToBeAdded)
    cy.get('.label.blue')
      .should('contain', 'Gebietskarte drucken')
    cy.get('.label.assignment')
      .should('contain', 'Zuteilungen')
    cy.get('.label.do-not-visit')
      .should('contain', 'Nicht besuchen Adressen')
  })


  it('für den Fall dass Karte nicht angecklickt werden kann', () =>
  {
    cy.get('.input')
      .type('Haunstetten-Nord')
  })

  it('Gebietskarte drucken', () =>
  {
    cy.get('app-list-item > .main-wrapper > .label.blue')
      .click()
    cy.get('.card-format-TerritoryCardFormat\\.s12 > .main-wrapper > .label')
    //cy.get('.mapboxgl-canvas')
    //  .should('have.attr', 'height', '781')
    cy.get('.card-format-TerritoryCardFormat\\.a6 > .main-wrapper > .label')
      .click()
    //cy.get('.mapboxgl-canvas')
    //  .should('have.attr', 'height', '871')
    cy.get('.card-format-TerritoryCardFormat\\.a6 > .action > .icon > .feather')
    cy.get('.bleed-edge-shadow')
      .should('not.be.visible')

    //cy.get('.comment')
    //  .should('not.contain', 'Das ist ein Test-Kommentar')
    cy.get('.preferences.ng-star-inserted > .wrapper').children().click({ multiple: true })
    cy.get('.bleed-edge-shadow')
      .should('be.visible')
    cy.get('.place')
      .should('contain', territoriesToBeAdded[1].place)
    cy.get('.number')
      .should('contain', territoriesToBeAdded[1].number)
    cy.get('.population-count')
      .should('contain', territoriesToBeAdded[1].units + ' WE')
    cy.get('.compass')
    cy.get('i-feather[name="rotate-cw"]')
      .click()
    cy.get('.comment')
      .should('contain', 'Das ist ein Test-Kommentar')
    cy.get('i-feather[name="arrow-down-circle"]')
    cy.get('.street-name')
      .should('contain', streetsToBeAdded[0])
      .and('contain', streetsToBeAdded[1])
    cy.get('.cancel')
      .click()
  })

  it('Zuteilungen', () =>
  {
    cy.get('.label.assignment')
      .click()
    cy.get('.action.edit')
      .should('contain', '+ Neue Zuteilung')
      .click()
    cy.get('.cancel')
      .click()

    cy.get('.action.edit')
      .should('contain', '+ Neue Zuteilung')
      .click()
    cy.get('.save.not-valid')
      .should('contain', 'Speichern')

    cy.get('input[placeholder="Verkündiger"]')
      .type('A')
    cy.get('.search-result').first()
      .should('contain', 'Amadeus Amadeus')
      .click()


    cy.get('.start-time .label')
      .should('contain', 'Ausgabedatum')
      .click()
    cy.get('.info')
      .should('contain', currDate)

    cy.get('.end-time .label')
      .should('contain', 'Rückgabedatum')
      .click()
    cy.get('.end-time .info')
      .should('contain', '-')
    cy.get('.end-time .highlight').first()
      .wait(2000)
      .click()
    cy.get('.end-time .info')
      .should('contain', currDate)

    cy.get('.send-not-to-publisher > .feather')
    cy.contains('Gebietskarte an Verkündiger senden')
      .click()
    cy.get('.send-to-publisher > .feather')
    cy.contains('Gebietskarte an Verkündiger senden')
      .click()

    cy.get('.save')
      .click()
    cy.get('app-assignments')
      .should('contain', 'Amadeus')

    cy.get('.label.blue')
      .should('contain', 'Zuteilung bearbeiten')
      .click()
    cy.get('.delete-assignment')
      .dblclick()

    cy.get('app-assignments')
      .should('not.contain', 'Amadeus')

    cy.get('.action.edit')
      .click()
    cy.get('.save.not-valid')
      .should('contain', 'Speichern')
    cy.get('input[placeholder="Verkündiger"]')
      .type('B')
    cy.get('.search-result').first()
      .click()
    cy.get('.save')
      .click()
    cy.get('app-assignments')
      .should('contain', 'Bertholt')

    cy.get('[name="repeat"] > .feather')
      .click()
    cy.get('.scrollable-wrapper > :nth-child(2)')
      .should('contain', 'Bertholt Bertholt')
    cy.get('[name="download"] > .feather')
      .click()
      .wait(1000)
    cy.get('p.info').eq(1).invoke('text').then((text) =>
    {
      expect(text).equal(currDate)
    });
    cy.get('.back')
      .click()
  })
  it('Nicht besuchen Adressen testen', () =>
  {

    //Hin und Zurück
    cy.contains('Nicht besuchen')
      .click()
    cy.get('.back')
      .click()
    cy.contains('Nicht besuchen')
      .click()

    cy.contains('+ Neue Adresse')
      .click()
    cy.get('.cancel')
      .click()
    cy.contains('+ Neue Adresse')
      .click()

    //ohne Pflichtfeld speichern

    //Pflichtfeld  & Speichern
    cy.get('input[placeholder="Name"]')
      .click()
      .type('Uwe NichtBesuchen')
    cy.get('input[placeholder="Adresse*"]')
      .click()
      .type('Leitershofer Straße 120')

    /*Fehler
    cy.contains('Leitershofer')
      .click()
    */

    cy.get('textarea[placeholder="Kommentar"]')
      .click()
      .type('Uwe ist nicht dabei!')
    cy.contains('Letzter Besuch')
      .click()
    cy.get('.date-selector .highlight').first()
      .wait(1500)
      .click()
    cy.get('.app-panel')
      .eq(4)
      .find('.info')
      .should('contain', currDate)

  })
})
