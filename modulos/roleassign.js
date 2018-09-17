module.exports.run = async (client,message,args) =>{
    if(message.permiso>=2){

        console.log(args);
        var user = args[0];
        var rol = args[1];
        

        let role = message.member.guild.roles.find("name", rol);

        //console.log(role);
        /*rol.forEach(function (value, key, mapObj) {  
            console.log("Nombre: "+value.name+" --- ID: "+value.id+" --- Posicion: "+value.position);  
        })*/
    // member.addRole(role).catch(console.error);


    } else {
        message.channel.send("@"+message.author.username+", no tienes permisos para utilizar ese comando");
    }
}

module.exports.help = {
    name: "rol",
    description: "Comando para añadir un rol a un usuario.  !rol <@usuario> <rol>",
    hidden: false,
    require: false,
    admin: true,
    mod: true,
    test: false
}