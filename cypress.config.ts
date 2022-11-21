import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:3000'
  },

  viewportHeight: 720,
  viewportWidth: 1270,

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
