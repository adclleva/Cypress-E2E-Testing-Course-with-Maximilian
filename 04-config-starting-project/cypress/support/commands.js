// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// this is a custom command
Cypress.Commands.add('submitForm', () => {
  cy.get('form button[type="submit"]').click();
})

// this is a custom query
// these are retry-able functions, that will retry for about 4 seconds
Cypress.Commands.addQuery('getById', (id) => {
  // this tells Cypress to execute any Cypress commands instantly instead
  // of having it queued up behind other commands
  // the now command shouldn't be used within the test code
  // this function will be used for immediate assertions
  // we do this because it will fail during cypress run or cypress open
  const getFn = cy.now('get',`[data-cy="${id}"]`);

  // this return function will be retried
  return () => {
    const element = getFn();
    return element
  }
})