/// <reference types="cypress" />

const LONGITUDE = 48.01;
const LATITUDE = 37.5;
const NAME = 'John Doe';

describe('share location', () => {
  beforeEach(() => {
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
                latitude: LATITUDE,
                longitude: LONGITUDE,
              }
            }
          )
        }, 100)
      })

      // writeText expects a promise and make sure it resolves
      cy.stub(window.navigator.clipboard, 'writeText').as('saveToClipboard').resolves();
    });
  })
  it('should fetch the user location', () => {
    cy.get('[data-cy="get-loc-btn"]').click();
    // we can "get" an alias and check if it was called
    cy.get('@getUserPosition').should('have.been.called')

    cy.get('[data-cy="get-loc-btn"]').should('be.disabled')

    cy.get('[data-cy="actions"]').should('contain', 'Location fetched!') // alternative to contains()

  });

  it('should share the location URL', () => {
    cy.get('[data-cy="name-input"]').type(NAME);

    cy.get('[data-cy="get-loc-btn"]').click();
    cy.get('[data-cy="share-loc-btn"]').click();

    cy.get('@saveToClipboard').should('have.been.called')

    cy.get('@saveToClipboard').should(
      'have.been.calledWithMatch',
      // the regex has the latitude, longitude and name, with any
      // characters in between
      // make sure to do encodeURI on the name to make it pass
      new RegExp(`${LATITUDE}.*${LONGITUDE}.*${encodeURI(NAME)}`)
    );
  })
});
