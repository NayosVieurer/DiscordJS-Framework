const cron = require('node-cron');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const utils = require("./Utils.js");
const db = require("./database.js");

let remap = {};

function refreshRemap()
{

  let promise = new Promise((resolve, reject) =>
  {
    fs.readdir("./Commands", (err, files) =>
    {
      if(err) return console.log(err);

      files.forEach(file =>
      {
        let commandFile = require("./Commands/" + file);
        let fileRemap = commandFile.remapList();

        fileRemap.then(list =>
        {
          list.forEach(commandId =>
          {
            remap[commandId] = file;
          });
        });
      });

      resolve();
    });

    fs.readdir("./Channels", (err, files) =>
    {
      if(err) return console.log(err);

      files.forEach(file =>
      {
          let channelFile = require("./Channels/" + file);
          remap[channelFile.channelId] = file;
      });
    });
  });
}

function handleCommand(message)
{
  let fullCommand = message.content.slice(config.prefix.length).trim().split("-");
  let commandName = fullCommand.shift().trim().replace(/ +/g, "_").toLowerCase();

  let commandFileName = remap[commandName];

  let args = fullCommand.length > 0 ? fullCommand.shift().split(/ +/g) : [];

  let method = args[0] != undefined ? args.shift() : "run";

  args.push(commandName);

  try {
    commandFile = require("./Commands/"+ commandFileName);
    commandFile[method](client, message, args);
  } catch (err) {
    console.log(err);

    utils.errorMessage(message);
  }
}

exports.refreshRemap = refreshRemap;
exports.handleCommand = handleCommand;

client.on("ready", async () => {

  refreshRemap();

  db.dbConnection();

  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds. \n `);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Perdu sur Hurston`);

});

client.on("message", message => {

	if (message.author.bot || config.blacklist.includes(message.author.id))
    return;

  if(config.SpecialChannels.includes(message.channel.id))
  {
    let channelFile = require("./Channels/" + remap[message.channel.id]);
    channelFile.run(message, client)
    return;
  }

  if(message.content.indexOf(config.prefix) != 0)
    return;

  handleCommand(message);

  utils.deleteMessage(message);

});

client.login(config.token);
