async function modulos(client,prefix){

    //--- Modulos ---
    const control = require("./sistema/control.js");
    const gestorComandos = require("./gestor-comandos.js");
    //---------------



    client.on('guildMemberAdd', member => {
        const channel = member.guild.channels.find('name', 'member-log');
        if (!channel) return;
        channel.send(`Bienvenido al servidor, ${member}.`);
    });
    
    
    
    client.on("message", async message => {
    
        if (!message.content.startsWith(prefix)) return;
        if (message.author.bot) return;

        gestorComandos.comando(client,message,prefix);
    
        control.espiar(message.author,message);
    });
}
exports.modulos = modulos;