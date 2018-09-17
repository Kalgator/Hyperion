//--------------------------------------------------------------------------------------------------
//----------------------------------- Bienvenido a Hyperion BOT ------------------------------------
//--------------------------------------------------------------------------------------------------
//-------------------------------------- Invitación del BOT ----------------------------------------
//-- https://discordapp.com/oauth2/authorize?client_id=447104346153418762&permissions=8&scope=bot --
//--------------------------------------------------------------------------------------------------

const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.mutes = require("./modulos/sistema/mutes.json");

fs.readdir("./modulos/", (err, files)=>{
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0){
        console.log("No se ha cargado ningun modulo.");
        return;
    }

    console.log(`Cargando ${jsfiles.length} modulos...`);
    
    jsfiles.forEach((f,i) =>{
        let props = require(`./modulos/${f}`);
        console.log(`${i + 1}: ${f} cargado!`);
        client.commands.set(props.help.name, props);
    });
});

const gestor = require("./gestor-modulos.js");

client.on("ready", async () => {
    console.log("La red Hyperion ha sido activada.");
    console.log("-------------------------------------------");


    /*try{
        let link = await client.generateInvite(["ADMINISTRATOR"]);
        console.log("Invitación: "+link);
    } catch(e){
        console.log(e.stack);
    }*/

});

client.prefix = config.prefix;
gestor.modulos(client);
client.hyperionToken = config.token;
client.login(config.token);


//CREATE TABLE roles (server VARCHAR(30) NOT NULL, rol VARCHAR(30) NOT NULL, exp int NOT NULL, mvp BOOLEAN);