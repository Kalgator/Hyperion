const Discord = require("discord.js");
module.exports.run = async (client,message, args, con) =>{
    const embed = new Discord.RichEmbed();
    embed.setColor("#FF8000");

    if(message.member.hasPermission("ADMINISTRATOR")){
        if(args.length >= 1){
            if(args[0].toLowerCase() === "restart"){

                if(args.length >= 2){
                    if(args[1].toLowerCase() === "all"){
                        await con.query(`DELETE FROM modulos WHERE server = '${message.guild.id}'`);
                        await client.commands.forEach(com => {
                            if(!com.help.test){
                                con.query(`INSERT INTO modulos(id, server, state) VALUES ('${com.help.name}', '${message.guild.id}', 1)`);
                            }
                        });
                        message.channel.send("Todos los comandos han sido activados con exito.");
        
                    } else if(args[1].toLowerCase() === "default"){
                        await con.query(`DELETE FROM modulos WHERE server = '${message.guild.id}'`);
                        await client.commands.forEach(com => {
                            con.query(`INSERT INTO modulos(id, server, state) VALUES ('${com.help.name}', '${message.guild.id}', ${com.help.require})`);
                        });
                        message.channel.send("Los comandos default han sido activados con exito.");
                    } else if(args[1].toLowerCase() === "test"){
                        await con.query(`DELETE FROM modulos WHERE server = '${message.guild.id}'`);
                        await client.commands.forEach(com => {
                            //if(!com.help.test){
                                con.query(`INSERT INTO modulos(id, server, state) VALUES ('${com.help.name}', '${message.guild.id}', 1)`);
                            //}
                        });
                        message.channel.send("Todos los comandos existentes han sido activados con exito.");
        
                    } else {
                        message.channel.send("Es necesario añadir un parametro correcto.");
                        embed.setTitle("!config restart <parametro>");
                        embed.addField("all", "Añadirá todos los comandos existentes.");
                        embed.addField("default", "Añadirá los comandos por defecto.");
                        message.channel.send({embed})
                    }
                } else {
                    message.channel.send("Es necesario añadir un parametro.");
                    embed.setTitle("!config restart <parametro>");
                    embed.addField("all", "Añadirá todos los comandos existentes.");
                    embed.addField("default", "Añadirá los comandos por defecto.");
                    message.channel.send({embed})
                }
                
            }
            if(args[0].toLowerCase() === "add"){
                if(args.length >= 2){
                    var exist = false;

                    client.commands.forEach(com => {
                        if(com.help.name === args[1]){
                            exist = true;
                        }
                    });
                    if(exist){
                        con.query(`UPDATE modulos SET state = 1 WHERE id = '${args[1].toLowerCase()}' AND server = '${message.guild.id}'`);
                        message.channel.send("El comando "+args[1].toLowerCase()+" ha sido añadido con exito.");
                    } else {
                        message.channel.send("El comando "+args[1].toLowerCase()+" no existe.  !config list ");
                    }
                    
                } else {
                    message.channel.send("Es necesario indicar que comando quieres añadir.");

                    embed.setTitle("!config add <comando>");

                    client.commands.forEach(com => {
                        if(!com.help.hidden){
                            embed.addField(com.help.name, com.help.description);
                        }
                    });
                    message.channel.send({embed});
                }
            }
            if(args[0].toLowerCase() === "del"){
                if(args.length >= 2){
                    var exist = false;
                    client.commands.forEach(com => {
                        if(com.help.name === args[1] && !com.help.require){
                            exist = true;
                        }
                    });
                    if(!exist){
                        message.channel.send("El comando "+args[1].toLowerCase()+" no existe o no puede ser eliminado.");
                    } else {
                        con.query(`UPDATE modulos SET state = 0 WHERE id = '${args[1].toLowerCase()}' AND server = '${message.guild.id}'`);
                        message.channel.send("El comando "+args[1].toLowerCase()+" ha sido eliminado con exito.");
                    }
                } else {
                    message.channel.send("Es necesario indicar que comando quieres eliminar.");

                    embed.setTitle("!config del <commando>");

                    client.commands.forEach(com => {
                        if(!com.help.hidden && !com.help.test){
                            embed.addField(com.help.name, com.help.description);
                        }
                    });
                    message.channel.send({embed});
                }
            }
            // LISTA PARA MOSTRAR TODOS LOS MODULOS DISPONIBLES
            if(args[0].toLowerCase() === "list"){
                embed.setTitle("!config <add|del|restart> <comando>");

                client.commands.forEach(com => {
                    if(!com.help.hidden){
                        embed.addField(com.help.name, com.help.description);
                    }
                });

                message.channel.send({embed});
            }
            //CONFIGURAR EL PARAMETRO EXPERIENCIA
            else if(args[0].toLowerCase() === "exp"){
                if(args.length>=2){
                    let rol = message.guild.roles.find(r => r.name === args[2]);       
                    if(args[1].toLowerCase() === "add"){
                        if(!rol){
                            try{
                                rol = await message.guild.createRole({
                                    name: args[2],
                                    color: "#000000",
                                    permissions: [],
                                    hoist: true,
                                    mentionable: true
                                });
                                
                            } catch(e){
                                console.log(e.stack);
                            }
                        }
                        if(args.length >= 4){

                            con.query(`SELECT * FROM roles WHERE server = '${message.guild.id}' AND rol = '${rol.id}'`, (err, rows) => {
                                if(err) throw err;
                        
                                let sql;
                        
                                if(rows.length <1){
                                    sql = `INSERT INTO roles(server, rol, exp, mvp) VALUES ('${message.guild.id}', '${rol.id}',${parseInt(args[3])}, false)`;
                                } else {
                                    con.query(`DELETE FROM roles WHERE server = '${message.guild.id}' AND rol = '${rol.id}'`);
                                    sql = `INSERT INTO roles(server, rol, exp, mvp) VALUES ('${message.guild.id}', '${rol.id}',${parseInt(args[3])}, false)`;
                                }
                        
                                con.query(sql);

                                embed.setTitle("El rol "+rol.name+" ha sido añadido con "+args[3]+" puntos de experiencia.");
                                message.channel.send({embed});
                            });

                        } else {
                            embed.setTitle("Te falta algún campo por rellenar.  !config exp add <Rol> <Exp>");
                            message.channel.send({embed});
                        }
                    } else if(args[1].toLowerCase() === "del"){
                        if(args.length >=3){
                            if(!rol){
                            console.log("El rol "+args[2]+" no existe.")
                            }
                            con.query(`DELETE FROM roles WHERE server = '${message.guild.id}' AND rol = '${rol.id}'`);
                            embed.setTitle("El rol "+rol.name+" ha sido eliminado.");
                            message.channel.send({embed});
                        } else {
                            embed.setTitle("Te falta algún campo por rellenar.  !config exp del <Rol>");
                            message.channel.send({embed});
                        }

                    } else if(args[1].toLowerCase() === "change"){
                        if(args.length >= 4){
                            let rol = message.guild.roles.find(r => r.name === args[2]);
                            if(!rol){
                                embed.setTitle("El rol "+args[2]+" no existe o lo has escrito mal.");
                                message.channel.send({embed});
                            } else {

                                con.query(`SELECT * FROM roles WHERE server = '${message.guild.id}' AND rol = '${rol.id}'`, (err, rows) => {
                                    if(err) throw err;
                            
                                    let sql;
                            
                                    if(rows.length <1){
                                        embed.setTitle("El rol "+rol.name+" no existe en la lista de experiencia o lo has escrito mal.");
                                        message.channel.send({embed});

                                    } else {
                                        con.query(`UPDATE roles SET exp = ${parseInt(args[3])} WHERE rol = '${rol.id}' AND server = '${message.guild.id}'`);
                                        embed.setTitle("El rol "+rol.name+" ha sido modificado a "+args[3]+" puntos de experiencia.");
                                    message.channel.send({embed});
                                    }

                                    
                                });
                            }

                        } else {
                            embed.setTitle("Te falta algún campo por rellenar.  !config exp add <Rol> <Exp>");
                            message.channel.send({embed});
                        }


                    } else if(args[1].toLowerCase() === "list"){
                        con.query(`SELECT * FROM roles WHERE server = '${message.guild.id}' ORDER BY exp DESC`, (err, rows) => {
                            if(err) throw err;
                            if(rows.length <1){
                                embed.setTitle("No tienes ningun rol en la lista de experiencia.");
                                message.channel.send({embed});
                            } else {
                                embed.setTitle("Listado de roles.");
                                rows.forEach(com => {
                                    let rol = message.guild.roles.find(r => r.id === com.rol);
                                    if(com.mvp){
                                        embed.addField(rol.name,"Es el MVP.");
                                    } else {
                                        embed.addField(rol.name,"Necesita "+com.exp+" puntos de experiencia.");
                                    }
                                
                                });
                                message.channel.send({embed});
                            }    
                        });

                        
                    } else if(args[1].toLowerCase() === "mvp"){
                        if(args.length >= 3){
                            let rol = message.guild.roles.find(r => r.name === args[2]);
                            if(!rol){
                                embed.setTitle("El rol "+args[2]+" no existe o lo has escrito mal.");
                                message.channel.send({embed});
                                return;
                            }
                            con.query(`SELECT * FROM roles WHERE server = '${message.guild.id}' AND rol = '${rol.id}'`, (err, rows) => {
                                if(err) throw err;
                        
                                let sql;
                                if(rows.length <1){
                                    embed.setTitle("El rol '"+args[2]+"' no está en la lista de experiencia, comprueba las mayusculas y minusculas.");
                                    message.channel.send({embed});
                                } else {

                                    con.query(`SELECT * FROM roles WHERE server = '${message.guild.id}' AND MVP = true`, (err, rows) => {
                                        if(err) throw err;
                        
                                        let sql;

                                        if(rows.length <1){

                                            con.query(`UPDATE roles SET mvp = 1 WHERE rol = '${rol.id}' AND server = '${message.guild.id}'`);

                                        } else {

                                            con.query(`UPDATE roles SET mvp = 0 WHERE rol = '${rows[0].rol}' AND server = '${message.guild.id}'`);
                                            con.query(`UPDATE roles SET mvp = 1 WHERE rol = '${rol.id}' AND server = '${message.guild.id}'`);

                                        }

                                        embed.setTitle("El rol "+args[2]+" ha sido añadido como el MVP.");
                                        message.channel.send({embed});
                                    });
                                }
                            });
                        } else {
                            embed.setTitle("Te falta añadir el rol.  !config exp mvp <rol>");
                            message.channel.send({embed});
                        }
                        

                    } else {
                        embed.setTitle("!config exp <add|del|change|list|mvp>");
                        embed.addField("!config exp add <Rol> <Exp>","Sirve para añadir un rol nuevo (ya creado o no)    ej. !config exp add Polluelo 1 100");
                        embed.addField("!config exp del <Rol>", "Sirve para eliminar un rango de la lista");
                        embed.addField("!config exp <change>");
                        embed.addField("!config exp <list>");
                        embed.addField("!config exp <addMVP|delMVP> <Rol>");
                        message.channel.send({embed});
                        
                    }


                } else {
                    embed.setTitle("!config exp <add|del|change|list|mvp>");
                    embed.addField("!config exp add <Rol> <Nivel> <Exp>","Sirve para añadir un rol nuevo (ya creado o no)    ej. !config exp add Polluelo 1 100");
                    embed.addField("!config exp del <Rol>", "Sirve para eliminar un rango de la lista");
                    embed.addField("!config exp <change>");
                    embed.addField("!config exp <list>");
                    embed.addField("!config exp <add|del> mvp <Rol>");
                    message.channel.send({embed});
                }
                
            }
            
        } else {
            //embed.setTitle("!config <add|del|restart> <comando>");
            embed.addField("!config <add> <comando>","Este comando sirve para añadir un modulo al servidor.");
            embed.addField("!config <del> <comando>","Este comando sirve para eliminar un modulo del servidor.");
            embed.addField("!config <restart> <all|default>","Este comando sirve para reiniciar los modulos del discord. <all> para añadir todos, <default> para añadir los imprescindibles.");
            embed.addField("!config <list>","Este comando sirve para mostrar una lista con todos los modulos existentes.");
            embed.addField("!config <exp> <add|del>","Este comando sirve para configurar el módulo de experiencia");

            
            message.channel.send({embed});
        }


    } else {
       message.channel.send(message.author.username+", no tienes permisos para utilizar este comando.")
    }
}

function getComandos(client, message, args, con){

    con.query(`SELECT * FROM modulos WHERE server = '${message.guild.id}'`)
}

module.exports.help = {
    name: "config",
    description: "Comando para configurar el bot en cada servidor.",
    hidden: true,
    require: true,
    admin: true,
    test: false
}