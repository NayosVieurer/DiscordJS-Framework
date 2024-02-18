const fs = require('fs');
const {Client, Events, GatewayIntentBits} = require('discord.js');
const client = new Client({
  intents:
  [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]});
const config = require('./config.json');
const utils = require("./Utils.js");
const db = require("./database.js");

let remap = {commands:[], channels:[]};

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
            remap.commands[commandId] = file;
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
          remap.channels[channelFile.channelId] = file;
      });
    });
  });
}

function handleCommand(message)
{
  let fullCommand = message.content.slice(config.prefix.length).trim().split("-");
  let commandName = fullCommand.shift().trim().replace(/ +/g, "_").toLowerCase();

  let commandFileName = remap.commands[commandName];

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

client.once(Events.ClientReady, async () => {

  refreshRemap();

  db.dbConnection();
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds. \n `);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Perdu sur Hurston`);

});

client.on(Events.VoiceStateUpdate, async (oldSate, newState) =>
{
  console.log("toto");
  let oldChannel = oldSate.channel;
  let newChannel = newState.channel;

  let oldChannelFile;
  let newChannelFile;

  if (oldChannel != null && remap.channels[oldChannel.id] != "undefined")
    oldChannelFile = require("./Channels/" + remap.channels[oldChannel.id]);

  if (newChannel != null && remap.channels[newChannel.id] != "undefined")
    newChannelFile = require("./Channels/" + remap.channels[newChannel.id]);

  if(oldChannel == newChannel)
  {

    newChannelFile.OnStateChange();
  }

  else
  {
    if(typeof oldChannelFile !== "undefined")
      oldChannelFile.OnLeave(client, oldSate.member, oldChannel);

    if(typeof newChannelFile !== "undefined")
      newChannelFile.OnEntry(client, newState.member, newChannel);
  }

});


client.on(Events.MessageCreate, async (message) => {


	if (message.author.bot || config.blacklist.includes(message.author.id))
    return;

  if(remap.channels[message.channel.id])
  {
    let channelFile = require("./Channels/" + remap.channels[message.channel.id]);
    channelFile.run(client, message)
    return;
  }

  console.log(message.content);

  console.log(message.content.indexOf(config.prefix));

  if(message.content.indexOf(config.prefix) != 0)
    return;

  console.log("toto");
  handleCommand(message);

  utils.deleteMessage(message);

});

client.login(config.token);
