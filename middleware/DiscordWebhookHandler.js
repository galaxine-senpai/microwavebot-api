const { WebhookClient, Embed, EmbedBuilder } = require("discord.js");
const { LoadLogger } = require("./StartupLogging.js");
const dotenv = require("dotenv");
dotenv.config();

const webhook = new WebhookClient({ url: process.env.WEBHOOK_URL });

const testEmbed = new EmbedBuilder()
  .setTitle("Test")
  .setColor("#FFA500")
  .setDescription("This is a test embed");

function sendEmbed(type, fnumber, fname, femail, type, fsuggestion) {
  if (type === "test") {
    webhook.send({
      content: "Test",
      username: "Microwave API",
      avatarURL: "https://www.microwavebot.com/img/favicon.ico",
      embeds: [testEmbed],
    });
  } else if (type === "suggestion") {
    if (femail === undefined && femail === null) {
      return (femail = "Not provided");
    }
    const suggestionEmbed = new EmbedBuilder()
      .setTitle({ title: "Suggestion" })
      .setColor("#FFA500")
      .addFields(
        { name: "Name", value: fname },
        { name: "ID", value: fnumber },
        { name: "Email", value: femail },
        { name: "Type", value: type },
        { name: "Suggestion", value: fsuggestion }
      );
    webhook.send({
      content: "New suggestion",
      username: "Microwave API",
      avatarURL: "https://www.microwavebot.com/img/favicon.ico",
      embeds: [suggestionEmbed],
    });
  }
}

LoadLogger("middleware", "DiscordWebhookHandler");

module.exports = sendEmbed;
