import { faker } from '@faker-js/faker'

describe('smoke tests', () => {
  beforeEach(() => {
    cy.resetDatabase()
  })

  it('should allow you to register and login', () => {
    const loginForm = {
      name: faker.name.fullName(),
      username: faker.internet.userName(),
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    }

    cy.visitAndCheck('/')
    cy.findByRole('link', { name: /log in/i }).click()
    cy.findByRole('link', { name: /sign up/i }).click()

    // register
    cy.findByRole('heading', { name: /sign up/i }).should('be.visible')
    cy.findByRole('textbox', { name: /email/i }).type(loginForm.email)
    cy.findByLabelText(/password/i).type(loginForm.password)
    cy.findByRole('button', { name: /create account/i })
      .as('create-button')
      .click()
    cy.get('@create-button').should('not.be.disabled')

    cy.contains('Name is required').should('be.visible')
    cy.findByLabelText('Name').should('have.focus').type(loginForm.name)
    cy.findByLabelText('Username').type(loginForm.username)
    cy.get('@create-button').click()
    cy.get('@create-button').should('not.exist')

    cy.findByRole('link', { name: /edit profile/i }).click()
    cy.findByRole('figure').find('cite').should('have.text', loginForm.username)

    // update profile
    const newUserName = faker.internet.userName()
    cy.findByLabelText('Username').type(`{selectAll}{backspace}${newUserName}`)
    cy.findByRole('button', { name: /update profile/i })
      .as('update-button')
      .click()
    cy.get('@update-button').should('not.be.disabled')
    cy.findByRole('figure').find('cite').should('have.text', newUserName)

    cy.findByRole('button', { name: /log out/i }).click()

    // login
    cy.findByRole('heading', { name: /log in/i }).should('be.visible')
    cy.findByRole('textbox', { name: /email/i }).type(loginForm.email)
    cy.findByLabelText(/password/i).type(loginForm.password)
    cy.findByRole('button', { name: /log in/i })
      .as('login-button')
      .click()
    cy.get('@login-button').should('not.exist')

    cy.findByRole('link', { name: /log in/i }).should('not.exist')
    cy.findByRole('link', { name: /edit profile/i }).should('be.visible')
    cy.findByRole('button', { name: /log out/i }).click()
  })

  it('should allow you to review a show', () => {
    const testReview = {
      score: '3',
      content: faker.lorem.paragraph(),
    }
    cy.login()
    cy.visitAndCheck('/shows')

    cy.findByRole('link', { name: /hermès/i })
      .should('have.length', 1)
      .click()

    // create review
    cy.findByLabelText('Review score')
      .findAllByRole('radio')
      .filter(`[value="${testReview.score}"]`)
      .should('have.length', 1)
      .as('score')
      .click()
    cy.get('@score').should('have.attr', 'aria-checked', 'true')
    cy.findByLabelText('What did you think of the runway?')
      .as('content-textbox')
      .type(testReview.content)
    cy.findByRole('button', { name: /submit review/i }).click()

    cy.findByRole('heading', { name: /consumer reviews/i })
      .parent()
      .findAllByRole('figure')
      .should('have.length', 1)
      .find('blockquote')
      .as('review-blockquote')
      .should('contain', testReview.content)
      .find('strong')
      .should('have.text', `${testReview.score}/5`)

    // edit review
    const newContent = faker.lorem.paragraph()
    cy.get('@content-textbox').type(`{selectAll}{backspace}${newContent}`)
    cy.findByRole('button', { name: /edit review/i }).click()
    cy.get('@review-blockquote')
      .should('not.contain', testReview.content)
      .and('contain', newContent)
  })
})
