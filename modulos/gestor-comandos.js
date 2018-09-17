function comando(client,message,prefix){

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //const permisos = require("./sistema/permisos.js");

    /*let rol = message.guild.roles.find("name", "Administrador");

    console.log(message.guild.roles);
    if(message.member.roles.has(rol.id)) {
        var admin = true;
    } else {
        var admin = false;
    }*/

    if(command === "ping"){
        const ping = require("./sistema/ping.js");
        ping.ping(message);
    }
    if(command === "rol"){
        const role = require("./utiles/roleassign.js");
        role.assign(client,message);
    }

}

exports.comando = comando; 