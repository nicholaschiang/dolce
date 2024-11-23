import '@testing-library/cypress/add-commands'

import { faker } from '@faker-js/faker'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in with a random user. Yields the user and adds an alias to the user
       *
       * @returns {typeof login}
       * @memberof Chainable
       * @example
       *    cy.login()
       * @example
       *    cy.login({ email: 'whatever@example.com' })
       */
      login: typeof login

      /**
       * Deletes the current @user
       *
       * @returns {typeof cleanupUser}
       * @memberof Chainable
       * @example
       *    cy.cleanupUser()
       * @example
       *    cy.cleanupUser({ email: 'whatever@example.com' })
       * @deprecated Use `cy.resetDatabase()` instead
       */
      cleanupUser: typeof cleanupUser

      /**
       * Clears and seeds the database
       *
       * @returns {typeof resetDatabase}
       * @memberof Chainable
       * @example
       *    cy.resetDatabase()
       */
      resetDatabase: typeof resetDatabase

      /**
       * Extends the standard visit command to wait for the page to load
       *
       * @returns {typeof visitAndCheck}
       * @memberof Chainable
       * @example
       *    cy.visitAndCheck('/')
       * @example
       *    cy.visitAndCheck('/', 500)
       */
      visitAndCheck: typeof visitAndCheck

      /**
       * Set up an intercept for a Remix action or loader in the route
       *
       * @returns {typeof api}
       * @memberof Chainable
       * @example
       *    cy.api('POST', 'api.shows.$showId.review').as('reviewAPI')
       */
      api: typeof api
    }
  }
}

function login({
  email = faker.internet.email(undefined, undefined, 'example.com'),
}: {
  email?: string
} = {}) {
  cy.then(() => ({ email })).as('user')
  cy.exec(
    `pnpm exec ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts "${email}"`,
  ).then(({ stdout }) => {
    const cookieValue = stdout
      .replace(/.*<cookie>(?<cookieValue>.*)<\/cookie>.*/s, '$<cookieValue>')
      .trim()
    cy.setCookie('__session', cookieValue)
  })
  return cy.get('@user')
}

function cleanupUser({ email }: { email?: string } = {}) {
  if (email) {
    deleteUserByEmail(email)
  } else {
    cy.get('@user').then((user) => {
      const person = user as { email?: string } | undefined
      if (person?.email) deleteUserByEmail(person.email)
    })
  }
  cy.clearCookie('__session')
}

function deleteUserByEmail(email: string) {
  cy.exec(
    `pnpm exec ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts "${email}"`,
  )
  cy.clearCookie('__session')
}

function resetDatabase() {
  cy.exec('pnpm prisma migrate reset --force --skip-generate')
}

function api(method: string, route: string) {
  const searchParams = new URLSearchParams({ _data: `routes/${route}` })
  return cy.intercept(method, RegExp(`[\\?&]${searchParams.toString()}$`))
}

// We're waiting a second because of this issue happen randomly
// https://github.com/cypress-io/cypress/issues/7306
// Also added custom types to avoid getting detached
// https://github.com/cypress-io/cypress/issues/7306#issuecomment-1152752612
// ===========================================================
function visitAndCheck(url: string, waitTime: number = 1000) {
  cy.visit(url)
  cy.location('pathname').should('contain', url).wait(waitTime)
}

Cypress.Commands.add('login', login)
Cypress.Commands.add('resetDatabase', resetDatabase)
Cypress.Commands.add('cleanupUser', cleanupUser)
Cypress.Commands.add('visitAndCheck', visitAndCheck)
Cypress.Commands.add('api', api)

Cypress.on('uncaught:exception', (err) => {
  // Cypress and React Hydrating the document don't get along
  // for some unknown reason. Hopefully we figure out why eventually
  // so we can remove this.
  if (
    /hydrat/i.test(err.message) ||
    /Minified React error #418/.test(err.message) ||
    /Minified React error #423/.test(err.message)
  ) {
    return false
  }

  // TODO remove this once we fix the issue upstream in the Radix <Form>
  // primitive. Right now, we expect to see some control errors.
  // @see {@link https://linear.app/nicholaschiang/issue/NC-683}
  if (/setCustomValidity is not a function/.test(err.message)) return false
})
