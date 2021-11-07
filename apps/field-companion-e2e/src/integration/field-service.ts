const currDay = new Date().getDate();
const currMonth = new Date().getMonth();
const currYear = new Date().getFullYear();

const inputsIncrease = [
  'data-cy=icon-duration-plus-main-input',
  'data-cy=icon-deliveries-plus-main-input',
  'data-cy=icon-videos-plus-main-input',
  'data-cy=icon-return-visits-plus-main-input',
];
const inputsDecrease = [
  'data-cy=icon-duration-minus-main-input',
  'data-cy=icon-deliveries-minus-main-input',
  'data-cy=icon-videos-minus-main-input',
  'data-cy=icon-return-visits-minus-main-input',
];

describe('field-service', () => {
  it('- day chosen (before and after) \n - currDay should have dot', () => {
    cy.get('[data-cy=info-box-no-day-chosen]');
    cy.get('[data-cy=inputs-field-service]').should('not.exist');

    cy.get('[data-cy=number-days-calendar]').contains(currDay).click();

    cy.get('[data-cy=number-days-calendar]')
      .contains(currDay)
      .children()
      .should('have.attr', 'data-cy', 'curr-day-with-dot');

    cy.get('[data-cy=info-box-no-day-chosen]').should('not.exist');
    cy.get('[data-cy=inputs-field-service]');
  });

  it('change color of day cell if data exists', () => {
    cy.get('[data-cy=number-days-calendar]').contains(currDay).should('not.have.class', 'has-data');

    inputsIncrease.forEach((name, index) => {
      cy.get(`[${inputsIncrease[index]}]`).click();
      cy.get('[data-cy=number-days-calendar]').contains(currDay).should('have.class', 'has-data');
      cy.get(`[${inputsDecrease[index]}]`).click();
      cy.get('[data-cy=number-days-calendar]')
        .contains(currDay)
        .should('not.have.class', 'has-data');
    });
  });

  it('counters & overview', () => {
    //explicit-duration-input noch checken!
  });
});
