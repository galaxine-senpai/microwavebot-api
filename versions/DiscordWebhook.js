const sendEmbed = require("../middleware/DiscordWebhookHandler.js");
const { LoadLogger } = require("../middleware/StartupLogging.js");
const express = require("express");
const router = express.Router();

// "/" page that returns 403 in json
router.get("/", (req, res, next) => {
  res.status(403).json({ error: "Forbidden" });
});

// The actual page that sends the webhook
router.get("/send", (req, res, next) => {
    // Get embed type from query
    if (req.query.type === undefined) {
        return res.status(400).json({ error: "Type required" });
    }
    const type = req.query.type;
    if (type) {
        if (type === "test") {
            sendEmbed({ type: "test" });
            res.json({ status: "Sent" });
        } else if (type === "suggestion") {

            const fieldslist = ["number", "name", "email", "type", "suggestion"];
            // A function to check if all the required fields are present and returns 400 if not along with a message that shows which is missing
            const checkFields = (fields) => {
                for (const field of fields) {
                    if (req.query[field] === undefined) {
                        return res.status(400).json({ error: `Query \'${field}\' required` });
                    }
                }
            }

            checkFields(fieldslist);

            
            sendEmbed(
                "suggestion",
                req.query.number,
                req.query.name,
                req.query.email || "Not provided",
                req.query.type,
                req.query.suggestion
            );
            res.json({ status: "Sent" });
        }
    }
});


LoadLogger("router", "DiscordWebhook");

module.exports = router;