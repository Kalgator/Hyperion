const Discord = require("discord.js");

module.exports.run = async (client,message, args, con) =>{

    
    const comandos = client.commands;


    const embed = new Discord.RichEmbed();
    embed.setTitle("Comandos de "+message.guild.name);
    embed.setColor("#FF8000");

    con.query(`SELECT * FROM modulos WHERE server = '${message.guild.id}'`, (err,rows) =>{
        if(err) throw rows;
        if(rows.length >=1){
            comandos.forEach(com => {
                rows.forEach(row =>{
                    if(row.id === com.help.name && row.state){
                        if(!com.help.admin && !com.help.hidden){
                            embed.addField(com.help.name, com.help.description);
                        } else if (message.member.hasPermission("ADMINISTRATOR")){
                            embed.addField(com.help.name, com.help.description);
                        }
                    }
                })                
            });

            message.channel.send({embed});

        } else {
            message.channel.send("Este servidor no tiene comandos activados.\nUtilice el comando !config para solucionar el problema.");
        }
    })

    
}

module.exports.help = {
    name: "help",
    description: "Comando para mostrar la lista de comandos.",
    hidden: true,
    require: true,
    admin: false,
    mod: false,
    test: false
}