/**
 * Centralized Express Error Handler Middleware.
 * Catches unhandled errors in route handlers and formats standard JSON error responses.
 */
function errorHandler(err, req, res, next) {
  console.error(`[API ERROR] ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  let userMessage = err.message || 'An unexpected internal server error occurred.';
  if (err.message && err.message.includes('Could not perform discovery')) {
    userMessage = 'Unable to connect to the graph database. Please check connection credentials or network status.';
  }

  res.status(statusCode).json({
    success: false,
    error: userMessage,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;
