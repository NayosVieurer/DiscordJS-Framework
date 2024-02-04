const Discord = require('discord.js');
const config = require('./config.json');

exports.deleteMessage = (message) =>
{
  setTimeout(function() {
    message.delete();
  }, 333);
}


exports.errorMessage = (message) =>
{
  const embed = new Discord.MessageEmbed()
    .setTitle("**" + message.author.username + " your command syntax is wrong <:__:434260715449352203> **")
    .setTimestamp()
    .setImage("https://imgur.com/LJTb5CQ.png")
    .setFooter(text="carefull with copy and past")
    .setColor("#b90000");
  let erreur = message.channel.send({embed})

  erreur.then(value => {
    setTimeout(function() {
      value.delete();
    }, 8000);
  });
}

exports.checkPermissions = (message) =>
{
  if (config.ModsRoles.length == 0)
    return true;

  for (var i = 0; i < config.ModsRoles.length; i++)
  {
    if(message.member.roles.cache.has(config.ModsRoles[i]))
    {
      return true;
    }
  }


  message.channel.send("Hold on, you're not allowed to use this command")
  .then(message =>
    {
      setTimeout(function()
      {
        message.delete();
      }, 1500);
    });
  return false;
}
