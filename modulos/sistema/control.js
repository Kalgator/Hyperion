function espiar(user,message){

	var permiso = message.permiso;
	var rango = "Usuario"

	if (permiso==3){
		rango = "Administrador"; 
	} else 	if( permiso == 2){
		rango = "Moderador";
	} else {
		rango = "Usuario"
	}

	console.log("----------------------");
	console.log("Comando ejecutado por: "+user.username+"#"+user.discriminator);
	console.log("Servidor: '"+message.guild.name+"' - '"+message.guild.id+"'");	
	console.log("Rango: '"+rango+"'");
	console.log("Hora: "+message.createdAt);
	console.log("Mensaje: '"+message.content+"'");
	console.log("----------------------");
	return;
}

//CONTROL PARA VER SI UN SERVIDOR TIENE UN COMANDO
function servidor(servidor,message){
	const config = require("./config.json"); //<-- Esto será MYSQL para obtener datos

	console.log(message.channel.guild.id+" - "+message.channel.guild.name);

}

exports.espiar = espiar;