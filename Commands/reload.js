const fs = require("fs");
const config = require('../config.json');
const bot = require("../bot.js");
const utils = require("../Utils.js");

exports.remapList = async () => {

  return ["reload"];
}

exports.run = (client, message, args) =>{

  if(!utils.checkPermissions(message))
    return;

  fs.readdir("./Commands/", (err, files) => {
    if(err) return console.error(err);

    files.forEach(file =>{

      delete require.cache[require.resolve("./"+ file)];
    });
  });

  fs.readdir("./Channels/", (err, files) => {
    if(err) return console.error(err);

    files.forEach(file =>{

      delete require.cache[require.resolve("../Channels/"+ file)];
    });
  });

  bot.refreshRemap();

  console.log("commands and channels have been refreshed");
}
