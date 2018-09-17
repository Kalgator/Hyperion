
module.exports.run = async (client,message, args) =>{
        let mensajes = Date.now() - message.createdTimestamp;
        let ping = Math.floor(message.client.ping);
        
        message.channel.send(`:incoming_envelope: Ping Mensajes: \`${Math.floor(mensajes/100)} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);
}

module.exports.help = {
    name: "ping",
    description: "Comando para medir la respuesta entre un mensaje, el bot y la API de Discord.",
    hidden: false,
    require: true,
    admin: false,
    mod: false
}