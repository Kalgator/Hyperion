module.exports.run = async (client,message,args) =>{

    if(parseInt(message.guild.id) == "446926260774502401") {

        if(!args[0]) return;
        var rol = args[0];
        const guildMember = message.member;


        let role = message.member.guild.roles.find("name", rol);


        if(role){

            guildMember.removeRole(message.member.guild.roles.find("name", "PC")).catch(console.error);
            guildMember.removeRole(message.member.guild.roles.find("name", "Nintendo")).catch(console.error);
            guildMember.removeRole(message.member.guild.roles.find("name", "Xbox")).catch(console.error);
            guildMember.removeRole(message.member.guild.roles.find("name", "Sony")).catch(console.error);

            await guildMember.addRole(role).catch(console.error);
            message.channel.send(message.author.username+", ahora perteneces a "+rol+".");
        } else {
            message.channel.send("Algo va mal... "+message.author.username+", prueba a escribir <PC|Nintendo|Xbox|Sony>.");
        }

    } else {
        return message.channel.send("No tienes permisos para utilizar este comando.");
    }
    
}

module.exports.help = {
    name: "iam",
    description: "Escoge tu bando. !iam <PC|Nintendo|Sony|Xbox>",
    hidden: true,
    require: false,
    admin: false,
    mod: false,
    test: false
}