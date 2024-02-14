// Empty, use for index.js stuff only

const { LoadLogger } = require("../middleware/StartupLogging.js");
LoadLogger("middleware", "Main");

module.exports = { getServerIP };
