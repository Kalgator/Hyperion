async function modulos(client){
    const fs = require("fs");
    const mysql = require("mysql");
    const config = require("./config.json");


    var con = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database
    })

    con.connect(err => {
        if(err) throw err;
        console.log("Conexion a la base de datos realizada correctamente.");
        //con.query("SHOW TABLES", console.log);
    });

    //--- Modulos ---
    const control = require("./modulos/sistema/control.js");
    const xp = require("./modulos/sistema/xp.js");

    //const gestorComandos = require("./gestor-comandos.js");
    //---------------

    client.on("ready", async () => {
    
        client.setInterval(() => {
            for(let i in client.mutes){
                let time = client.mutes[i].time;
                let guildId = client.mutes[i].guild;
                let guild = client.guilds.get(guildId);
                let member = guild.members.get(i);
                let muteRol = guild.roles.find(r => r.name === "Silenciado");
                if(!muteRol) continue;
    
                if(Date.now() > time){
                    console.log(`${i} ya no está muteado!`)
                    member.removeRole(muteRol);
                    delete client.mutes[i];

                    fs.writeFile("./modulos/sistema/mutes.json", JSON.stringify(client.mutes), err =>{
                        if(err) throw err;
                        console.log(`${member.user.tag} ya no está silenciado.`);
                    })
                }
            }
        }, 5000)
        
        //xp.setMVP(client,con)
        client.setInterval(() => {

            con.connect(err => {
                //if(err) console.log("La base de datos ya está conectada");
            });
            console.log("Comienzo del MVP.");
            xp.setMVP(client,con)
            
        }, 60000) //ESTO ES 1 MINUTO --- 36000000 ES UNA HORA
        //}, 60000)


        //xp.setVoiceXP(client,message,args,con)
        client.setInterval(() => {
            con.connect(err => {
                //if(err) console.log("La base de datos ya está conectada");
            });
            console.log("Generando experiencia por Voice Channel.");
            xp.setVoiceXP(client,con)
            
        }, 600000) //ESTO SON 10 MINUTOS
    
        client.setInterval(() => {
            var token = client.hyperionToken;
            console.log('Reiniciando bot... '+token);
            client.destroy()
            .then(() => client.login(token));
            
        }, 86400100) //ESTO ES UN DIA

    });

    //MODULO DE BIENVENIDA UNIVERSAL
    client.on('guildMemberAdd', member => {
        const channel = member.guild.channels.find('name', 'member-log');
        if (!channel) return;
        channel.send(`Bienvenido al servidor, ${member}.`);
    });


    //MODULO ENTRADA AL SERVIDOR
    client.on("guildCreate", guild => {
        console.log("Hyperion ha entrado en " + guild.name);
        //CARGA TODOS LOS MODULOS OBLIGADOS EN LA DB
        client.commands.forEach(com => {
            if(com.help.require){
                con.query(`INSERT INTO modulos(id, server, state) VALUES ('${com.help.name}', '${guild.id}', 1)`);
            }
        });
    })
    
    
    
    client.on("message", async message => {
    
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        
        const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
        if(!message.member.hasPermission("ADMINISTRATOR")){
            await xp.genXP(client,message,args,con);
            xp.setRole(client,message,args,con);
        }
        
        if (!message.content.startsWith(client.prefix)) return;

        con.connect(err => {
            //if(err) console.log("La base de datos ya está conectada");
        });
        
        const command = args.shift().toLowerCase();

        const permisos = require("./modulos/sistema/permisos.js");
        message.permiso = permisos.getPermisos(message);
        
        let cmd = client.commands.get(command);

        if(cmd){
            if(command === "config" && message.member.hasPermission("ADMINISTRATOR")){
                cmd.run(client,message,args,con);
            } else if ( cmd.help.test && message.member.hasPermission("ADMINISTRATOR")){
                cmd.run(client,message,args,con);
            } else {
                con.query(`SELECT * FROM modulos WHERE id = '${command}' AND server = '${message.guild.id}'`, (err,rows) =>{
                    if(err) throw err;
                    if(rows.length >=1){
                        if(rows[0].state){
                            if(cmd.help.admin){
                                if(message.member.hasPermission("ADMINISTRATOR")){
                                    cmd.run(client,message,args,con);
                                } else {
                                    message.channel.send(message.author.username+", no tienes permisos para utilizar este comando.");
                                }
                            } else if(cmd.help.mod){
                                if(message.member.hasPermission("MANAGE_MESSAGES")){
                                    cmd.run(client,message,args,con);
                                } else {
                                    message.channel.send(message.author.username+", no tienes permisos para utilizar este comando.");
                                }
                            } else {
                                cmd.run(client,message,args,con);
                            }
                        } else {
                            message.channel.send("Lo siento, ese comando no está disponible.");
                        }
                    } else {
                        message.channel.send("Comando no encontrado.");
                    }
                    
                })
            }
            
        } 
        control.espiar(message.author,message);
    });
}
exports.modulos = modulos;