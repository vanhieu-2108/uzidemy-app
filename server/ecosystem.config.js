// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'web-e-learning',
      script: './dist/index.js',
      env: {
        NODE_ENV: 'dev'
      },
      env_production: {
        NODE_ENV: 'prod'
      }
    }
  ]
}
