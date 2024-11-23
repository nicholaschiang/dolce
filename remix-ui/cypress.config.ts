import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    projectId: '9dj6b9',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents: (on, config) => {
      const isDev = config.watchForFileChanges
      const port = process.env.PORT ?? (isDev ? '6969' : '8811')
      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
      }

      // To use this:
      // cy.task('log', whateverYouWantInTheTerminal)
      on('task', {
        log: (message) => {
          console.log(message)
          return null
        },
      })

      return { ...config, ...configOverrides }
    },
  },
})
