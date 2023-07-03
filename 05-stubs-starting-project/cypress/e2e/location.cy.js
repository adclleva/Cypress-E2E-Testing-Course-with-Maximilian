/// <reference types="cypress" />
const NAME = 'John Doe';

describe('share location', () => {
  beforeEach(() => {
    // fixtures are used to mock data
    cy.fixture('user-location.json').as('userLocation');

    // using then helps us get direct access to the element for example
    // get yields the window object
    // we do this because we know that we need to get access to the window object
    // when accessing the / route
    cy.visit('/').then((window) => {
      // we get the @userLocation alias to get access to the fixture data
      cy.get('@userLocation').then(fakePositionData => {
        // we create an alias of this stub
        cy.stub(window.navigator.geolocation, 'getCurrentPosition')
        .as('getUserPosition')
        // this function replaces getCurrentPosition with a fake function
        // this get executed immediately when the function is called
        .callsFake((cb) => { // cb is the callback function
          // we use a timeout to simulate the delay of the function
          // to get the loading spinner
          setTimeout(() => {
            cb(fakePositionData)
            }, 100)
          })
        })

      // writeText expects a promise and make sure it resolves
      cy.stub(window.navigator.clipboard, 'writeText').as('saveToClipboard').resolves();

      // these spies are used to check if the functions are called
      cy.spy(window.localStorage, 'setItem').as('setToLocalStorage')
      cy.spy(window.localStorage, 'getItem').as('getFromLocalStorage')
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

    cy.get('@userLocation').then(fakePositionData => {
      const {longitude, latitude} = fakePositionData.coords;

      cy.get('@saveToClipboard').should(
        'have.been.calledWithMatch',
        // the regex has the latitude, longitude and name, with any
        // characters in between
        // make sure to do encodeURI on the name to make it pass
        new RegExp(`${latitude}.*${longitude}.*${encodeURI(NAME)}`)
      );

      // we check if the location is stored in the local storage
      cy.get('@setToLocalStorage').should(
        'have.been.calledWithMatch',
        /John Doe/,
        new RegExp(`${latitude}.*${longitude}.*${encodeURI(NAME)}`))
    })
    cy.get('@setToLocalStorage').should('have.been.called')

    // this tests if the location is already stored when we click the button
    cy.get('[data-cy="share-loc-btn"]').click();
    cy.get('@getFromLocalStorage').should('have.been.called')
  })
});


/**
 * spy vs stub
 *
 * spies are listeners that are attached to functions
 * spies are used for evaluating/asserting function calls
 * spies don't change the behavior of the function
 *
 * stubs are used to replace the function with a fake function
 * stubs are used for evaluating and controlling function calls
 * stubs do replace the function
 */