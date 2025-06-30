const serverless = require('serverless-http');
// Import the Express app from the backend root. The file used to be named
// `app.js`, but it now lives at `index.js`.
const app = require('../index');

module.exports = serverless(app);
