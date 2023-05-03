/// <reference types="Cypress" />

describe('contact form', () => {
  it("should navigate between pages", () => {
    cy.visit("http://127.0.0.1:5173/about")

    cy.get('[data-cy="contact-input-message"]').type('Hello World!')
    cy.get('[data-cy="contact-input-name"]').type('John Doe')
    cy.get('[data-cy="contact-btn-submit"]').then((el) => { // el is the subject of get()
      expect(el.attr('disabled')).to.be.undefined
      expect(el.text()).to.eq('Send Message')
    })

    cy.get('[data-cy="contact-input-email"]').type('test@example.com{enter}') // => user hitting the enter button
    // cy.get('[data-cy="contact-btn-submit"]').contains('Send Message').should('not.have.attr', 'disabled')
    // the top is equivalent to the bottom
    // you can't use the 'should' keyword inside the 'then' function scope

    // const btn = cy.get('[data-cy="contact-btn-submit"]') => this does not work

    cy.get('[data-cy="contact-btn-submit"]').as('submitBtn') // this is an alias that can be yielded
    cy.get('@submitBtn').click() // adding the @ enables us to use aliases
    cy.get('@submitBtn').contains('Sending...')
    cy.get('@submitBtn').should("have.attr", 'disabled')
  })

  it("should validate the input", () => {
    cy.visit("http://127.0.0.1:5173/about")

    cy.get('[data-cy="contact-btn-submit"]').click()
    cy.get('[data-cy="contact-btn-submit"]').then(el => {
      expect(el).to.not.have.attr('disabled')
      expect(el.text()).to.not.equal('Sending...')
    })
    cy.get('[data-cy="contact-btn-submit"]').contains("Send Message")

    // blurring input fields
    // we can check/select a class that is dynamic
    // we can get hold of the parent or child of an element
    // we want to focus an element
    // since cypress can't blur and element that wasn't previously focused
    cy.get('[data-cy="contact-input-message"]').as("msgInput")
    cy.get("@msgInput").focus().blur()
    cy.get('@msgInput')
      .parent()
      .should('have.attr', 'class')
      .and('match', /invalid/) // this uses a reg expression, this case, if it uses the word invalid

      // .and is an alias for should
      // .and('equal', 'invalid') this shows an exact, which would not work in this case

      // this fails when you run npx cypress run
      // .then((el) => {
      //   expect(el.attr('class')).to.contains('invalid')
      // })

    cy.get('[data-cy="contact-input-name"]').as("nameInput")
    cy.get('@nameInput').focus().blur()
    cy.get('@nameInput')
    .parent()
    .should('have.attr', 'class')
    .and('match', /invalid/)
    // .then((el) => {
    //   expect(el.attr('class')).to.contains('invalid')
    // })

    cy.get('[data-cy="contact-input-email"]').as("emailInput")
    cy.get('@emailInput').focus().blur()
    cy.get('@emailInput')
    .parent()
    .should('have.attr', 'class')
    .and('match', /invalid/)
    // .then((el) => {
    //   expect(el.attr('class')).to.contains('invalid')
    // })
  })
})