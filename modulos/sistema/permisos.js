function getPermisos(message){

    var permisos = 0;

    if(getAdmin(message)){
        permisos = 3;
    } else if (getMod(message)){
        permisos = 2;
    } else {
        permisos = 1;
    }
    return permisos;
}

function getAdmin(message){
    const perm = require("./permisos.json");

    //let role = message.guild.roles.find("name", "Administrador");
    //ESTO ES UNA PRUEBA
    /*var rol = message.guild.roles;
    rol.forEach(function (value, key, mapObj) {  
        console.log("Nombre: "+value.name+" --- ID: "+value.id+" --- Posicion: "+value.position);  
    });*/
    //console.log(perm[]);
    if(message.member.roles.some(r=>perm.admin.includes(r.name)) ) {
        return true;
    } else{
        return false;
    }
}

function getMod(message){
    const perm = require("./permisos.json");


    if(message.member.roles.some(r=>perm.mod.includes(r.name)) ) {
        return true;
    } else{
        return false;
    }
}

exports.getPermisos = getPermisos;
exports.getAdmin = getAdmin; 
exports.getMod = getMod; 