const fs = require("fs");

module.exports.run = async (client,message,args) =>{
    
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No tienes permiso para moderar mensajes.");

    let mutear = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    //console.log(message.guild.member(args[0]));
    if(!mutear) return message.channel.send("No has especificado ningun usuario o ID.");


    if(mutear.id === message.author.id) return message.channel.send("No puedes silenciarte a ti mismo");
    if(mutear.highestRole.position >= message.member.highestRole.position) return message.channel.send("No puedes silenciar a un usuario con tu mismo rango o superior.");

    let rol = message.guild.roles.find(r => r.name === "Silenciado");
    
    
    await mutear.removeRole(rol);

    delete client.mutes[mutear.id];

    fs.writeFile("./modulos/sistema/mutes.json", JSON.stringify(client.mutes), err =>{
        if(err) throw err;
        console.log(`${mutear.user.tag} ya no está silenciado.`);
    })
    return message.channel.send(message.mentions.users.first().username+" ya no está silenciado.");
    
}

module.exports.help = {
    name: "unmute",
    description: "Comando para eliminar el estado de Silenciado.  !unmute <@usuario>",
    hidden: false,
    require: false,
    admin: false,
    mod: true,
    test: false
}