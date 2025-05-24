function syntaxErrorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON syntax.',
      details: err.message,
    });
  }
  next(err);
}

module.exports = { syntaxErrorHandler };
