const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/ErrorHandler.js");
const MorganLogging = require("./middleware/MorganLogging.js");
const DiscordWebhookHandler = require("./middleware/DiscordWebhookHandler.js");
const { LoadLogger } = require("./middleware/StartupLogging.js");
const KeyGen = require("./middleware/KeyGen.js");

// - - - Morgan Logging - - -
app.use(MorganLogging);

// - - - Routers - - -

app.use("/v1", require("./versions/v1.js"));
app.use("/webhook", require("./versions/DiscordWebhook.js"));

// - - - End Routers - - -

app.get("/", (req, res) => {
  const APIVerAvail = {
    APIVersionsAvailable: ["v1"],
  };

  res.json(APIVerAvail);
});

app.get("/meow", (req, res) => {
  res.json({ error: "meow" });
});

app.get("/uptime", (req, res) => {
  const uptime = process.uptime();
  const formattedUptime = new Date(uptime * 1000).toISOString().slice(11, 19);
  res.json({ numeraluptime: formattedUptime });
});

// On 404 use the error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  next(err);
});
// 403 error
app.use((req, res, next) => {
  const err = new Error("Forbidden");
  next(err);
});
// 500 error
app.use((req, res, next) => {
  const err = new Error("Internal Server Error");
  next(err);
});

// - - - Middleware - - -

app.use(ErrorHandler);
app.use(DiscordWebhookHandler);
app.use(KeyGen);
// - - - Server Start - - -

// get server ip address

const port = 8180;

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
