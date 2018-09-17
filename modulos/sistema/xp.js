function setXP(client,message,args,con){
    const Discord = require("discord.js");
    const embed = new Discord.RichEmbed();
    embed.setColor("#FF8000");
    if(args.length >=3){
        if(message.mentions.users.first()){
            let target = message.mentions.users.first();
            
            
            con.query(`SELECT * FROM xp WHERE id = '${target.id}' AND server = '${message.guild.id}'`, (err, rows) => {
                if(err) throw err;
        
                let sql;
        
                if(rows.length <1){
                    sql = `INSERT INTO xp(id, server, xp) VALUES ('${target.id}', '${message.guild.id}',${parseInt(args[2])})`;
                    con.query(sql);
                    embed.setTitle("La experiencia de "+target.username+" ha cambiado a "+ parseInt(args[2]));
                    message.channel.send({embed});
                } else {
                    let xp = rows[0].xp;
                    sql = `UPDATE xp SET xp = ${xp + parseInt(args[2])} WHERE id = '${target.id}' AND server = '${message.guild.id}'`;
                    con.query(sql);
                    embed.setTitle("La experiencia de "+target.username+" ha cambiado a "+parseInt(xp + parseInt(args[2])));
                    message.channel.send({embed});
                }
    
            });
        } else {
            embed.setTitle("Tienes que mencionar al usuario con @.  !exp add <@usuario> <exp>");
            message.channel.send({embed});
        }

    } else {
        embed.setTitle("Te falta argumentos  !exp add <@usuario> <exp>");
        message.channel.send({embed});
    }
    
}

function genXP(client,message,args,con){
    con.query(`SELECT * FROM xp WHERE id = '${message.author.id}' AND server = '${message.guild.id}'`, (err, rows) => {
        if(err) throw err;

        let sql;

        if(rows.length <1){
            sql = `INSERT INTO xp(id, server, xp) VALUES ('${message.author.id}', '${message.guild.id}',${generarXP(message)})`;
        } else {
            let xp = rows[0].xp;
            sql = `UPDATE xp SET xp = ${xp + parseInt(generarXP(message))} WHERE id = '${message.author.id}' AND server = '${message.guild.id}'`;
        }

        con.query(sql);
    });
}

function generarXP(message){
    var exp = 0;
    if(message.content.length >= 15){
        exp = message.content.length / 15;    

        if(exp > 5){
            exp = 5;
        }
    }
    return exp;
}

function setRole(client,message,args,con){
    con.query(`SELECT * FROM xp WHERE id = '${message.author.id}' AND server = '${message.guild.id}'`, (err, rows) => {
        if(err) throw err;


        if(rows.length >=1){
            let xp = parseInt(rows[0].xp);
            con.query(`SELECT * FROM roles WHERE exp <= ${xp} AND server = '${message.guild.id}' ORDER BY exp DESC`, (err, rows2) => {
                if(err) throw err;
                if(rows2.length>=1){
                    var control = true;
                    //console.log(message.member.roles);
                    rows2.forEach(com => {

                        if(xp >= parseInt(com.exp)){
                            if(control && message.member.roles.find("id", com.rol)){
                                control = false;

                            } else if(!control && message.member.roles.find("id", com.rol)) {
                                var rol = message.guild.roles.find(r => r.name === com.rol);
                                message.member.removeRole(rol);
                            } else if(control){
                                control = false;
                                var rol = message.guild.roles.find(r => r.id === com.rol)
                                message.member.addRole(rol);
                                const Discord = require("discord.js");
                                const embed = new Discord.RichEmbed();
                                embed.setColor("#FF8000");
                                embed.setTitle("Felicidades "+message.author.username+", acabas de subir de rango a "+rol.name);

                                message.channel.send({embed});
                            }
                        }                       
                    }); 
                }

            });
        }
    });
}

function setMVP(client,con){
    con.query(`SELECT * FROM roles WHERE mvp = 1`, (err, serverm) => {
        if(err) throw err;

        if(serverm.length>=1){
            serverm.forEach( server =>{
                var servidor = client.guilds.find("id", server.server);
                
                con.query(`SELECT * FROM xp WHERE server = '${servidor.id}' ORDER BY xp DESC`, (err, rows) => {
                    if(err) throw err;

                    if(rows.length>=1){

                        rows.forEach( com =>{
                            
                            if(servidor.members.find("id", com.id)){
                                var user = servidor.members.find("id", com.id);
                                var rol = servidor.roles.find("id", server.rol);
                                
                                if(user){
                                    //console.log(user.user.id);
                                    if(user.roles.find("id", server.rol)){
                                        if(user.user.id === rows[0].id){
                                         //console.log(user.user.username+" es el MVP y ya tiene MVP en "+servidor.name);
                                        } else if(user.user.id != rows[0].id){
                                            //console.log(user.user.username+" ya no es el MVP y  tiene MVP en "+servidor.name);
                                            user.removeRole(rol);
                                        }
                                    } else if(user.user.id === rows[0].id){
                                        //console.log(user.user.username+" es el nuevo MVP y no tiene MVP en "+servidor.name); 
                                        user.addRole(rol)  
                                    }
                                }
                            }
                             
                        });
                    };
                });
            });
        }
    });
}

function setVoiceXP(client,con){
    //console.log("---------- Test Voice XP -------------");
    

    client.guilds.forEach( com =>{
        let server = com;
        let exp = 1;

        server.members.forEach( com2 =>{
            
            if(com2.voiceChannel && com2.voiceChannel){
                if(com2.voiceChannel.id != com2.voiceChannel.guild.afkChannelID)
                {
                    if(!com2.hasPermission("ADMINISTRATOR")){
                        con.query(`SELECT * FROM xp WHERE id = '${com2.id}' AND server = '${server.id}'`, (err, rows) => {
                            if(err) throw err;
                    
                            let sql;
                    
                            if(rows.length <1){
                                sql = `INSERT INTO xp(id, server, xp) VALUES ('${com2.id}', '${server.id}', 10)`;
                            } else {
                                let xp = rows[0].xp;
                                sql = `UPDATE xp SET xp = ${xp + exp} WHERE id = '${com2.id}' AND server = '${server.id}'`;
                            }
                            con.query(sql);
                        });
                    }
                }
            }

        });
    });
}




exports.genXP = genXP;
exports.setXP = setXP;
exports.setRole = setRole;
exports.setMVP = setMVP;
exports.setVoiceXP = setVoiceXP;