/** @type {import('@mikro-orm/core').Options} */
const config = {
  forceUndefined: true,
  type: 'better-sqlite',
  dbName: '.data/app.sqlite3',
  entities: ['./src/database/entities'],
  debug: false,
  migrations: {
    fileName: (timestamp) => `migration-${timestamp}`,
    tableName: 'migrations',
    path: './src/database/migrations'
  }
};

export default config;
