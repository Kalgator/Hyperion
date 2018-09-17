module.exports.run = async (client,message,args,con) =>{

    var twitchStreams = require('twitch-get-stream')('opbdckzs5yb4pfk80u2xw8p5k9byi9')
    if(args[0] == ""){
        console.log(args);
        twitchStreams.raw(args[0]).then(function(stream){
            console.log("está conectado");  
        }).catch(function (err){
            console.log("no está conectado");
        });
    } else {
        console.log("Necesitas escribir mas campos");
    }


    //AQUI SE DARÁ DE ALTA Y BAJA LOS CANALES, en sistema/twitchSystem.js SE CONTROLARÁ SI ESTÁ CONECTADO O NO UN USUARIO QUE ESTÉ EN LA BASE DE DATOS  (CANAL + SERVIDOR + ULTIMA CONEXIÓN SI/NO)

    //SI LA ULTIMA VEZ ESTABA CONECTADO, NO MOSTRAR MENSAJE, SI NO LO ESTABA, MOSTRAR MENSAJE Y ACTUALIZAR A SI LA ULTIMA CONEXION, CADA MINUTO CONTROLAR A VER SI ESTÁN CONECTADOS, Y ENVIAR MENSAJES POR DISCORD

    //CONFIG CHANNELS/TWITCH PARA CONTROLAR POR DONDE HABLARÁ EL BOT

}


module.exports.help = {
    name: "twitch",
    description: "Comando para añádir o eliminar canales de twitch.",
    hidden: true,
    require: false,
    admin: true,
    mod: false,
    test: true
}