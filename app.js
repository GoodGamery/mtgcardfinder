'use strict';

const Express = require('express');
const Cors = require('cors');

const ErrorHandlers = require('./src/error-handlers');
const Controllers = require('./controllers');

const app = Express();

app.use(Cors({
  origin: true
}));

// Expose the public directory as a static file resource
app.use(`/static`, Express.static('static'));

// Routes for the server to expose
app.use(Controllers);

// Error handling
app.use(ErrorHandlers.logErrors);
app.use(ErrorHandlers.clientErrorHandler);
app.use(ErrorHandlers.errorHandler);

// Allows testing
module.exports = app;
