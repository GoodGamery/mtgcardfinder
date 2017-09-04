function logErrors (err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Unhandled server error.' });
  } else {
    next(err);
  }
}

function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if (err.code)
    res.status(err.code);
  else
    res.status(500);
  res.json({ error: err });
}

module.exports = {
  logErrors,
  clientErrorHandler,
  errorHandler
};
