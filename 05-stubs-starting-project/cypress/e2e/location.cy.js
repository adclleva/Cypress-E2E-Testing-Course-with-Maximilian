/// <reference types="cypress" />

describe('share location', () => {
  it('should fetch the user location', () => {
    // using then helps us get direct access to the element for example
    // get yields the window object
    // we do this because we know that we need to get access to the window object
    // when accessing the / route
    cy.visit('/').then((window) => {
      // we create an alias of this stub
      cy.stub(window.navigator.geolocation, 'getCurrentPosition')
      .as('getUserPosition')
      // this function replaces getCurrentPosition with a fake function
      // this get executed immediately when the function is called
      .callsFake((cb) => { // cb is the callback function
        // we use a timeout to simulate the delay of the function
        // to get the loading spinner
        setTimeout(() => {
          cb(
            {
              coords: {
                latitude: 37.5,
                longitude: 48.01,
              }
            }
          )
        }, 100)
      })
    });

    cy.get('[data-cy="get-loc-btn"]').click();
    // we can "get" an alias and check if it was called
    cy.get('@getUserPosition').should('have.been.called')

    cy.get('[data-cy="get-loc-btn"]').should('be.disabled')

    cy.get('[data-cy="actions"]').should('contain', 'Location fetched!') // alternative to contains()

  });
});
