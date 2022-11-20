module.exports = {
  all: true,
  extends: "@istanbuljs/nyc-config-typescript",
  exclude: [
    'src/__tests__',
    'src/database/config',
    'src/database/migrations',
    'src/database/seeders',
    'src/app.ts',
    'src/server.ts'
  ],
  include: ['src/**/*.ts']
};
