const fs = require("fs");

module.exports.run = async (client,message,args) =>{
    
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No tienes permiso para moderar mensajes.");

    let mutear = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    console.log(message.guild.member(args[0]));
    if(!mutear) return message.channel.send("No has especificado ningun usuario o ID.");


    if(mutear.id === message.author.id) return message.channel.send("No puedes silenciarte a ti mismo");
    if(mutear.highestRole.position >= message.member.highestRole.position) return message.channel.send("No puedes silenciar a un usuario con tu mismo rango o superior.");

    let rol = message.guild.roles.find(r => r.name === "Silenciado");
    if(!rol){
        try{
            rol = await message.guild.createRole({
                name: "Silenciado",
                color: "#000000",
                permissions: []
            });
            
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(rol, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    ATTACH_FILES: false,
                    SPEAK: false

                });
            });
        } catch(e){
            console.log(e.stack);
        }
    }
    

    client.mutes[mutear.id] = {
        guild: message.guild.id,
        time: Date.now() + (parseInt(args[1]) * 1000) * 60
    }

    await mutear.addRole(rol);
        
    fs.writeFile("./modulos/sistema/mutes.json", JSON.stringify(client.mutes, null, 4), err =>{
        if(err) throw err;
        message.channel.send(message.mentions.users.first().username+" ha sido silenciado.");
    })
 
}

module.exports.help = {
    name: "mute",
    description: "Comando para silenciar a alguien. !mute <@usuario> <tiempo(min)>",
    hidden: false,
    require: false,
    admin: false,
    mod: true,
    test: false
}