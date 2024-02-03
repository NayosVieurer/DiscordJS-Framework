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
    .setTitle("**" + message.author.username + " il y a une erreur dans la commande <:__:434260715449352203> **")
    .setTimestamp()
    .setImage("https://imgur.com/LJTb5CQ.png")
    .setFooter(text="Attention à bien copier coller")
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
  console.log(config.ModsRoles.length);
  for (var i = 0; i < config.ModsRoles.length; i++)
  {
    if(message.member.roles.cache.has(config.ModsRoles[i]))
    {
      return true;
    }
  }


  message.channel.send("Minute papillon, t'as pas le droit a cette commande !")
  .then(message =>
    {
      setTimeout(function()
      {
        message.delete();
      }, 1500);
    });
  return false;
}
