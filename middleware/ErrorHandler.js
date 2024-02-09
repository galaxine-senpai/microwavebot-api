function errorHandler(err, req, res, next) {
  // Set the response status code
  res.status(err.status || 500);

  // Check if the request accepts JSON
  if (req.accepts("application/json")) {
    // Return true JSON
    res.json({ status: err.status, error: err.message });
  } else {
    // Return JSON as text
    res.send(JSON.stringify({ error: err.message, status: err.status }));
  }
}

const { LoadLogger } = require("./StartupLogging.js");
LoadLogger("middleware", "ErrorHandler");

module.exports = errorHandler;
