/// <reference types="cypress" />


describe('tasks page', () => { // suite
  it('should render the main image', () => {
    // cy is global an object that gives a command
    cy.visit('http://127.0.0.1:5173/') // make sure that the server is running
    cy.get(".main-header img") // this finds all imgs in the page on css selectors

    cy.get('.main-header').find('img')

    /**
     * get vs find
     * get will look for the element from the top
     * find can only be used after a get
     */
  })

  it("should display the page title", () => {
    cy.visit('http://127.0.0.1:5173/') // make sure that the server is running
    cy.get('h1').should("have.length", 1)
    cy.get('h1').contains("My Cypress Course Tasks")

    // contains("My Cypress Course Tasks")
  })
})