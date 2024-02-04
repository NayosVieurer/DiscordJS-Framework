//Add the channel id here
exports.channelId = "1203496044340580502";

exports.run = (client, message, args) =>
{
  console.log(message.channel);

  message.channel.send("this is a reply to a message in a specific channel");
};
