//Add the channel id here
exports.channelId = "";

exports.run = (client, message, args) =>
{
  message.channel.send("this is a reply to a message in a specific channel");
};
