import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    projectId: '9dj6b9',
    viewportHeight: 1500,
    viewportWidth: 1500,
    setupNodeEvents: (on, config) => {
      const isDev = config.watchForFileChanges
      const port = process.env.PORT ?? (isDev ? '3000' : '8811')
      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
        video: !process.env.CI,
        screenshotOnRunFailure: !process.env.CI,
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
