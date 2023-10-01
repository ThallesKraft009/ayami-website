const { Client, Events, GatewayIntentBits } = require('discord.js');
require("dotenv").config;
const config = require("./config.js")
const { connect } = require("mongoose")

const client = new Client({
  intents: [GatewayIntentBits.Guilds] 
});

client.once("ready", () => {
  require("./web.js")(client)
  connect(process.env.mongo)
})
client.userdb = require("./mongodb/user.js")
client.login(config.token)