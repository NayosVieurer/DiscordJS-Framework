const Discord = require('discord.js')

exports.run = async (client, message, args) =>
{

  const channel = message.channel;

  const response = channel.send("this is a test reply");
};

exports.remapList = async () =>
{
  return ["test"];
};
