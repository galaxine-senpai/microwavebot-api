const express = require("express");
const router = express.Router();
var cookieParser = require('cookie-parser')

router.use(express.json());
router.use(cookieParser());

// Function to auto fill the apikey query if the apikey cookie is present
router.use((req, res, next) => {
  if (req.cookies.apikey) {
    req.query.apikey = req.cookies.apikey;
  }
  next();
});

router.get("/", (req, res) => {
  res.set("Content-Type", "application/json");
  const token = req.cookies.apikey;
  if (req.cookies.registered === "true") {
    res.json({ APIVersion: "v1", status: "registered", key: token, availEndpoints : {
      "/users/?id=" : "Get user data *API KEY REQUIRED*"
    } });
  } else {
    res.json({ APIVersion: "v1", status: "unregistered", availEndpoints : {
      "/users/?id=" : "Get user data *API KEY REQUIRED*"
    }});
  }
});

router.get("/users/", (req, res) => {
  // Check for api key
  const apikey = req.query.apikey;
  const apikeys = require("../data/apikeys.json");
  if (!apikeys.keys.includes(apikey)) {
    return res.status(403).json({ error: "Invalid API Key" });
  }
  const users = require("../data/users.json");
  const id = req.query.id;
  if (users.hasOwnProperty(id)) {
    const user = users[id];
    res.json(user);
  } else {
    res.status(404).json({ error: "Invalid user ID" });
  }
});

router.get("/register/", (req, res) => {
  const KeyGen = require("../middleware/KeyGen.js");

  // Check for the "registered" cookie
  if (!req.cookies.registered) {
    // Generate token value false
    res.cookie("registered", "false", { maxAge: Date.now() + 2 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });

  }
  if (!req.cookies.apikey) {
    res.cookie("apikey", "false", { maxAge: Date.now() + 2 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
  }
  if (req.cookies.registered) {
    // check if cookie true
    if (req.cookies.registered === "true") {
      return res.status(403).json({ error: "You are already registered" });
    } else {
      // skip
    }
  }

  // Get the query data for registration token
  const token = req.query.token;
  if (token === undefined) {
    return res.status(400).json({ error: "Token required" });
  }

  // If token is in token.json then register a new key
  const { validTokens } = require("../data/tokens.json");

  if (validTokens.includes(token)) {
    const genToken = KeyGen(10);
    // set a cookie to prevent the user from registering again
    res.cookie("registered", "true", { maxAge: Date.now() + 2 * 365 *24 * 60 * 60 * 1000, httpOnly: true });
    res.cookie("apikey", genToken, { maxAge: Date.now() + 2 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.json({ status: "Key generated", token: genToken });
  }

  if (!validTokens.includes(token)) {
    res.status(403)
  }


});

router.get("/keys/", (req, res, next) => {
  if (!req.query.apikey) {
    return res.status(400).json({ status: "400", error: "API Key required" });
  }
  const apikeys = require("../data/apikeys.json");
  if (!apikeys.keys.includes(req.query.apikey)) {
    return res.status(400).json({ status: "400", error: "Invalid API Key" });
  }

  // Check if apikeys.adminkeys includes the apikey
  if (apikeys.adminkeys.includes(req.query.apikey)) {
    const keys = require("../data/apikeys.json");
    var validData = {
      keys:
        keys.keys
    }
    res.json(validData);
  } else {
    res.status(403).json({ status: "403", error: "Forbidden" });
  }
})


const { LoadLogger } = require("../middleware/StartupLogging.js");
LoadLogger("router", "v1");

module.exports = router;
