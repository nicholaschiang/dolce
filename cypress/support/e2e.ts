import '@testing-library/cypress/add-commands'
import './commands'

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
