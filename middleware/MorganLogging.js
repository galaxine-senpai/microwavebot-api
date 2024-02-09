const morgan = require("morgan");
const moment = require("moment");

function onLoad() {
  console.log(`\x1b[31m[MIDDLEWARE]\x1b[0m Morgan logging loaded`);
}

// - - - Morgan Logging - - -

morgan.token("date", (req, res, format) => {
  return moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ"); // Set to the systems timezone (hopefully)
});

const MorganLogging = morgan((tokens, req, res) => {
  let status = tokens.status(req, res);
  status = String(status).padEnd(3);

  let method = tokens.method(req, res);
  method = String(method).padEnd(2);

  let url = tokens.url(req, res);
  url = String(url).padEnd(20);

  let ip = req.headers["CF-connecting-ip"] || req.socket.remoteAddress;
  ip = String(ip).replace("::ffff:", "").padEnd(15);

  return `${tokens.date(req, res)} | [${method}] ${url} | ${ip} | Status: ${status}`;
});

onLoad();

module.exports = MorganLogging;
