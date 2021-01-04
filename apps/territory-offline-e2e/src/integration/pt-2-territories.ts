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
  comment: 'Das ist ein Test-Kommentar',
  streets: streetsToBeAdded,
},
{
  number: '2',
  place: 'Haunstetten-Nord',
  units: '30',
  comment: 'Das ist ein Test-Kommentar',
  streets: streetsToBeAdded,
}];

const tagToBeAdded = 'Dienstwoche';

const today = new Date();
const yesterday = new Date(Date.now() - 24*60*60*1000);
const formatDateToday = ('0' + today.getDate()).slice(-2) + '.' + ('0' + (today.getMonth() + 1)).slice(-2) + '.' + today.getFullYear();
const formatDateYesterday = ('0' + yesterday.getDate()).slice(-2) + '.' + ('0' + (yesterday.getMonth() + 1)).slice(-2) + '.' + yesterday.getFullYear();

function datePieces( date )
{
  const datePiece = date.split(".");
  const validDateInput = datePiece[2] + '-' + datePiece[1] + '-' + datePiece[0];
  return validDateInput;
}

describe('GebietsKomponente', () =>
{
  Cypress.on('uncaught:exception', (err, runnable) =>
  {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  before(() =>
  {
    // @ts-ignore
    cy.configureApp();

    // @ts-ignore
    cy.navigate('/dashboard');

    // @ts-ignore
    cy.createTags([tagToBeAdded, "Ungetauft"]);

    // @ts-ignore
    cy.createPublishers([{
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
      }])
  })

  it('Gebietsübersicht aufrufen und auf "+Neues Gebiet klicken"', () =>
  {
    cy.get('[data-cy=icon-menu-layers]')
      .click()
    cy.get('[data-cy=button-add-territory]')
      .click()
  })

  it('1."Speichern-Button" erst dann klickbar wenn Gebietszahl, -ort, -bereich angegeben \n 2.Gebietsauswahl wieder löschen \n 3.Gebiet hinzufügen Abbrechen', () =>
  {
    cy.get('[data-cy=button-save-second-thread-header]')
      .filter('.not-valid')

    cy.get('[data-cy=input-territory-number]')
      .type('1')
    cy.get('[data-cy=input-territory-location]')
      .type('Pfersee')
    territorySelection()
    cy.get('.mapbox-gl-draw_trash')
      .click()
    territorySelection()
    cy.get('[data-cy=button-save-second-thread-header]')
      .not('.not-valid')
    cy.get('[data-cy=button-cancel-second-thread-header]')
      .click()
  })
  it('Gebiete hinzufügen', () =>
  {
    let yTop = 100
    let yBottom = 160

    territoriesToBeAdded.forEach((territory) => {
      cy.get('[data-cy=button-add-territory]')
        .click()
      cy.get('[data-cy=input-territory-number]')
        .type(territory.number)
      cy.get('[data-cy=input-territory-location]')
        .type(territory.place)
      cy.get('[data-cy=input-territory-units]')
        .clear()
        .type(territory.units)
      cy.get('[data-cy=input-territory-comment]')
        .type(territory.comment)
      streetsToBeAdded.forEach((street) =>
      {
        cy.get('[data-cy=input-territory-street]')
          .type(street)
        cy.get('[data-cy=icon-add-territory-street]')
          .click()
      })
      cy.get('[data-cy=input-add-tag]')
        .clear()
        .type(tagToBeAdded)
      cy.get('[data-cy=search-result-tag]').first()
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
      cy.get('[data-cy=button-save-second-thread-header]')
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
    /*cy.get('[data-cy=text-overview-congregation-name]')
      .should('contain', 'Augsburg LM')
      */
    cy.get('[data-cy=filter-in-progress]')
      .should('contain', 'In Bearbeitung')
    cy.get('[data-cy=filter-finished]')
      .should('contain', 'Bearbeitet')
    cy.get('[data-cy=filter-to-assign]')
      .should('contain', 'Neu zuteilen')
    cy.get('[data-cy=filter-overdue-assignment]')
      .should('contain', 'Zuteilung fällig')
    cy.get('[data-cy=text-overview-filter-header]')
      .should('contain', 'Filter')
  })
  it('Gebiet suchen und bei einzigem Ergebnis ', () =>
  {
    cy.get('[data-cy=input-search]')
      .type('P')
    cy.get('[data-cy=info-location-second-thread]')
      .should('contain', 'Pfersee')
    cy.get('[data-cy=button-back-readonly-second-thread-header]')
      .click()
    cy.get('[data-cy=input-search]')
      .clear()
  })
  it('Gebiet suchen und bei mehreren Ergebnissen anzeigen', () =>
  {
    cy.get('[data-cy=input-search]')
      .type('Ha')
    cy.get('[data-cy=label-territory-list]')
      .should('contain', territoriesToBeAdded[1].place)
    cy.get('[data-cy=button-back-readonly-second-thread-header]')
      .click()
    cy.get('[data-cy=input-search]')
      .clear()
  })

  it('für den Fall dass Karte nicht angecklickt werden kann', () =>
  {
    cy.get('[data-cy=input-search]')
      .type(territoriesToBeAdded[1].place)
  })

  it('Gebiet auf Karte anklicken \n Felder prüfen', () =>
  {
    cy.get('.mapboxgl-canvas')
      .click(1000, 100)
    cy.get('[data-cy=label-location-second-thread]')
      .should('contain', 'Ort')
    cy.get('[data-cy=info-location-second-thread]')
      .should('contain', territoriesToBeAdded[1].place)
    cy.get('[data-cy=label-number-second-thread]')
      .should('contain', 'Nummer')
    cy.get('[data-cy=info-number-second-thread]')
      .should('contain', territoriesToBeAdded[1].number)
    cy.get('[data-cy=label-units-second-thread]')
      .should('contain', 'Wohneinheiten')
    cy.get('[data-cy=info-units-second-thread]')
      .should('contain', territoriesToBeAdded[1].units)
    cy.get('[data-cy=label-comment-second-thread]')
      .should('contain', 'Kommentar')
    cy.get('[data-cy=info-comment-second-thread]')
      .should('contain', territoriesToBeAdded[1].comment)
    cy.get('[data-cy=label-tags-second-thread]')
      .should('contain', 'Tags')
    cy.get('[data-cy=tags-preview-second-thread]')
      .should('contain', tagToBeAdded)
    cy.get('[data-cy=label-print-territory-second-thread]')
      .should('contain', 'Gebiet drucken')
    cy.get('[data-cy=label-assignment-second-thread]')
      .should('contain', 'Zuteilungen')
    cy.get('[data-cy=label-not-visit-second-thread]')
      .should('contain', 'Nicht besuchen Adressen')
  })

  it('Gebietskarte drucken', () =>
  {
    cy.get('[data-cy=label-print-territory-second-thread]')
      .click()
    cy.get('[data-cy=list-card-format-second-thread]').eq(0)
    cy.get('.mapboxgl-canvas').wait(1000)
      .invoke('css', 'height').then(value => Number(String(value).substring(0, 3)) + 0).should('be.lt', 357).and('be.gt', 354);

    cy.get('[data-cy=list-card-format-second-thread]').eq(1)
      .click()
      .children('.action')
      .children('[data-cy=icon-format-checked]')
    cy.get('[data-cy=list-card-format-second-thread]').eq(0)
      .children('.action')
      .children('[data-cy=icon-format-checked]')
      .should('not.exist')
    cy.get('.mapboxgl-canvas').wait(1000)
      .invoke('css', 'height').then(value => Number(String(value).substring(0, 3)) + 0).should('be.lt', 397).and('be.gt', 394);

    cy.get('[data-cy=bleeding-edges-territory-card]')
      .should('not.exist')
    cy.get('[data-cy=territory-name-card-heading]')
      .should('not.exist')
    cy.get('[data-cy=territory-number-card-heading]')
      .should('not.exist')
    cy.get('[data-cy=territory-units-card-heading]')
      .should('not.exist')
    cy.get('[data-cy=territory-compass-card-heading]')
      .should('not.exist')


    cy.get('[data-cy=territory-card-properties]').children().click({ multiple: true })
    cy.get('[data-cy=bleeding-edges-territory-card]')
      .should('exist')
    cy.get('[data-cy=territory-name-card-heading]')
      .should('have.text', territoriesToBeAdded[1].place)
    cy.get('[data-cy=territory-number-card-heading]')
      .should('have.text', territoriesToBeAdded[1].number)
    cy.get('[data-cy=territory-units-card-heading]')
      .should('contain', territoriesToBeAdded[1].units)
    cy.get('[data-cy=territory-compass-card-heading]')
    cy.get('[data-cy=button-flip-card-second-thread]')
      .click()
    cy.get('.comment')
      .should('contain', territoriesToBeAdded[1].comment)
    cy.get('.street-name')
      .should('contain', streetsToBeAdded[0])
      .and('contain', streetsToBeAdded[1])
    cy.get('[data-cy=button-cancel-second-thread-header]')
      .click()
  })

  it('Zuteilungen', () =>
  {
    cy.get('[data-cy=label-assignment-second-thread]')
      .click()
    cy.get('[data-cy=button-add-assignment-second-thread-header]')
      .click()
    cy.get('[data-cy=button-cancel-second-thread-header]')
      .click()

    cy.get('[data-cy=button-add-assignment-second-thread-header]')
      .click()
    cy.get('[data-cy=button-save-second-thread-header]')
      .filter('.not-valid')
      .should('contain', 'Speichern')

    cy.get('[data-cy=input-add-publisher]')
      .type('A')
    cy.get('[data-cy=search-result-publisher-list]').first()
      .should('have.text', 'Amadeus Amadeus')
      .click()


    cy.get('[data-cy=label-assignment-start-time]')
      .should('have.text', 'Ausgabedatum')
      .click()
    cy.get('[data-cy=info-assignment-start-time]')
      .should('have.text', formatDateToday)
    cy.get('[data-cy=input-date-start-time-assignment]')
      .click()
      .type(datePieces(formatDateYesterday))

    cy.get('[data-cy=label-assignment-end-time]')
      .should('have.text', 'Rückgabedatum')
    cy.get('[data-cy=info-assignment-end-time]')
      .should('have.text', '-')
    //cy.get('[data-cy=input-date-end-time-assignments]')
    //  .click()


    cy.get('[data-cy=icon-send-territory-card-false]')
    cy.get('[data-cy=icon-send-territory-card-true]').should('not.exist')
    cy.get('[data-cy=label-send-territory-card-assignment]')
      .click()
    cy.get('[data-cy=icon-send-territory-card-true]')
    cy.get('[data-cy=label-send-territory-card-assignment]')
      .click()

    cy.get('[data-cy=button-save-second-thread-header]')
      .click()
    cy.get('[data-cy=label-assignments-publisher]')
      .should('have.text', 'Amadeus Amadeus')

    cy.get('[data-cy=label-assignments-edit]')
      .should('have.text', 'Zuteilung bearbeiten')
      .click()
    cy.get('[data-cy=button-delete-assignment]')
      .dblclick()

    cy.get('[data-cy=label-assignments-publisher]')
      .should('not.exist')

    cy.get('[data-cy=button-add-assignment-second-thread-header]')
      .click()
    cy.get('[data-cy=button-save-second-thread-header]')
      .filter('.not-valid')
    cy.get('[data-cy=input-add-publisher]')
      .type('B')
    cy.get('[data-cy=search-result-publisher-list]')
      .first()
      .click()
    cy.get('[data-cy=button-save-second-thread-header]')
      .not('.not-valid')
      .click()
    cy.get('[data-cy=label-assignments-publisher]')
      .should('have.text', 'Bertholt Bertholt')

    cy.get('[data-cy=icon-assignments-repeat]')
      .click()
    cy.get('[data-cy=label-assignments-publisher]').eq(1)
      .should('have.text', 'Bertholt Bertholt')
    cy.get('[data-cy=icon-assignments-download]')
      .click()
      .wait(1000)
    cy.get('[data-cy=info-assignments-end-time]').eq(1)
      .should('have.text', formatDateToday)
    cy.get('[data-cy=button-back-specific-second-thread-header]')
      .click()
  })

  it('Nicht besuchen Adressen testen', () =>
  {

    //Hin und Zurück
    cy.get('[data-cy=label-not-visit-second-thread]')
      .click()
    cy.get('[data-cy=button-back-specific-second-thread-header]')
      .click()

    cy.get('[data-cy=label-not-visit-second-thread]')
      .click()
    cy.get('[data-cy=button-add-visit-ban-second-thread-header]')
      .click()
    cy.get('[data-cy=button-cancel-second-thread-header]')
      .click()
    cy.get('[data-cy=button-add-visit-ban-second-thread-header]')
      .click()

    //ohne Pflichtfeld speichern

    //Pflichtfeld  & Speichern
    cy.get('[data-cy=input-visit-ban-name]')
      .click()
      .type('Uwe NichtBesuchen')
    cy.get('[data-cy=input-visit-ban-address]')
      .click()
      .type('Leitershofer Straße 120')

    /*Fehler
    cy.contains('Leitershofer')
      .click()
    */

    cy.get('[data-cy=input-visit-ban-comment]')
      .click()
      .type('Uwe ist nicht dabei!')
    cy.get('[data-cy=label-visit-ban-last-visit]')
      .click()
    cy.get('.date-selector .highlight').first()
      .wait(1500)
      .click()
    cy.get('[data-cy=info-visit-ban-last-visit]')
      .should('have.text', formatDateToday)

  })
})
