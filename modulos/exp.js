const Discord = require("discord.js");
const xp = require("./sistema/xp.js");

module.exports.run = async (client,message,args,con) =>{
    let target = message.mentions.users.first() || message.author;
    var com;
    var mention;
    var top = false;
    var list = true;

    if(args[0] == "top" || args[0] == "Top") {
        top = true;
        com = `SELECT * FROM xp WHERE server = '${message.guild.id}' ORDER BY xp DESC LIMIT 10 `;
    } else if(message.member.hasPermission("ADMINISTRATOR") && (args[0] == "set" || args[0] == "add")){
        list = false;
        xp.setXP(client,message,args,con);
    } else if(message.mentions.users.first()){
        mention = true;
        com = `SELECT * FROM xp WHERE id = '${target.id}' AND server = '${message.guild.id}'`;
    } else {
        mention = false;
        com = `SELECT * FROM xp WHERE id = '${target.id}' AND server = '${message.guild.id}'`;
    }


    if(list) con.query(com, (err, rows) =>{
        if(err) throw err;

        if(rows.length >= 1){
            const embed = new Discord.RichEmbed();
            embed.setColor("#FF8000");
            let xp = rows[0].xp;
            if(mention){
                //embed.setTitle(message.guild.name+" - EXPERIENCIA ");
                embed.addField(target.username+"#"+target.discriminator,"Tiene "+xp+" puntos de experiencia.");
            } else if(top){
                
                embed.setTitle(message.guild.name+" - TOP EXPERIENCIA ");
                

                for(let i in rows){
                    var usuario = message.guild.member(rows[i].id);
                    if(usuario){
                        embed.addField("TOP "+(parseInt(i)+1),usuario.user.username+"#"+usuario.user.discriminator+" - "+rows[i].xp+"  puntos de experiencia.");
                    } else {
                        embed.addField("TOP "+(parseInt(i)+1),"Alguien se marchó del servidor con "+rows[i].xp+"  puntos de experiencia.");
                    }

                    continue;
                };
                
            } else {
                //embed.setTitle(message.guild.name+" - EXPERIENCIA ");
                embed.addField(target.username+"#"+target.discriminator,"Tienes "+xp+" puntos de experiencia.");
            }
            message.channel.send({embed});
            
        } else if(top){
            message.channel.send("Aun no hay un TOP de experiencia.");
        } else {
            message.channel.send("Este usuario no tiene puntos de experiencia.");
        }
        
    });
}

module.exports.help = {
    name: "exp",
    description: "Comando para comprobar tu experiencia, la de otro o el top 10.   !exp <opcional:@usuario|top>",
    hidden: false,
    require: false,
    admin: false,
    mod: false,
    test: false
}