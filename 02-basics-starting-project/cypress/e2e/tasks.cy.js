/// <reference types="cypress" />
// cypress runs tests in isolation

describe('tasks management', () => {
  it('should open and close the new task modal', () => {
    cy.visit('http://127.0.0.1:5173/') // make sure that the server is running
    cy.contains('Add Task').click() // contains can yield the element

    cy.get('.backdrop').click({ force: true})

    cy.get('.backdrop').should("not.exist")
    cy.get('.modal').should("not.exist")

    cy.contains('Add Task').click() // contains can yield the element
    cy.contains('Cancel').click()

    cy.get('.backdrop').should("not.exist")
    cy.get('.modal').should("not.exist")
  })

  it('should create a new task', () => {
    cy.visit('http://127.0.0.1:5173/') // make sure that the server is running
    cy.contains('Add Task').click() // contains can yield the element

    cy.get("#title").type('New Task')
    cy.get("#summary").type('Some description')
    cy.get('.modal').contains('Add Task').click()

    cy.get('.backdrop').should("not.exist")
    cy.get('.modal').should("not.exist")

    cy.get('.task').should('have.length', 1)
    cy.get('.task').contains('New Task')
    cy.get('.task').contains('Some description')
  })

  it("should validate user input", () => {
    cy.visit('http://127.0.0.1:5173/') // make sure that the server is running
    cy.contains('Add Task').click() // contains can yield the element

    cy.get('.modal').contains('Add Task').click()
    cy.contains("Please provide values")
  })

  it('should filter tasks', () => {
    cy.visit('http://127.0.0.1:5173/') // make sure that the server is running
    cy.contains('Add Task').click() // contains can yield the element

    cy.get("#title").type("New Task")
    cy.get("#summary").type("Some description")
    cy.get("#category").select('urgent')

    cy.get('.modal').contains('Add Task').click()

    cy.get('.task').should('have.length', 1)

    cy.get('#filter').select('moderate')
    cy.get('.task').should('have.length', 0)

    cy.get('#filter').select('urgent')
    cy.get('.task').should('have.length', 1)

    cy.get('#filter').select('all')
    cy.get('.task').should('have.length', 1)

  })

  it('should add multiple tasks', () => {
    cy.visit('http://127.0.0.1:5173/') // make sure that the server is running
    cy.contains('Add Task').click() // contains can yield the element

    cy.get("#title").type('Task 1')
    cy.get("#summary").type('First Task')
    cy.get('.modal').contains('Add Task').click()
    cy.get('.task').should('have.length', 1)

    cy.contains('Add Task').click() // contains can yield the element
    cy.get("#title").type('Task 2')
    cy.get("#summary").type('Second Task')
    cy.get('.modal').contains('Add Task').click()
    cy.get('.task').should('have.length', 2)

    cy.get('.task').eq(0).contains('First Task') // .first()
    cy.get('.task').eq(1).contains('Second Task') // .last()
  })
})