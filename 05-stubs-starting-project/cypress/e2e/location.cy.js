/// <reference types="cypress" />

describe('share location', () => {
  it('should fetch the user location', () => {
    // using then helps us get direct access to the element for example
    // get yields the window object
    // we do this because we know that we need to get access to the window object
    // when accessing the / route
    cy.visit('/').then((window) => {
      // we create an alias of this stub
      cy.stub(window.navigator.geolocation, 'getCurrentPosition').as('getUserPosition')
    });

    cy.get('[data-cy="get-loc-btn"]').click();
    // we can "get" an alias and check if it was called
    cy.get('@getUserPosition').should('have.been.called')
  });
});
