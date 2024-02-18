const {ChannelType, PermissionFlagsBits} = require('Discord.js');

//Add the channel id here
exports.channelId = "";

exports.OnEntry = async (client, member, channel) =>
{

  console.log("user connected");
};

exports.OnLeave = async (client, member, channel) =>
{
  console.log("user disconnected");
};
