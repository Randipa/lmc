const serverless = require('serverless-http');
// Import the Express app from the backend root. The file used to be named
// `app.js`, but it now lives at `index.js`.
const app = require('../index');

// In a serverless environment, open handles like database connections or the
// express-session store can keep the event loop active which prevents the
// request from finishing. By explicitly disabling the wait for the empty event
// loop, we ensure the response is returned immediately once Express finishes
// processing.
module.exports = serverless(app, {
  callbackWaitsForEmptyEventLoop: false
});
