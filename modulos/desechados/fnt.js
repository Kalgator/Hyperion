const Discord = require("discord.js");
let Fortnite = require("fortnite-api");

module.exports.run = async (client,message,args,fortnite) =>{
    let fortniteAPI = new Fortnite(["fortniteapi@thespiritbrothers.fr","fortniteapi2017","MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=","ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ="],{ debug: true });


    fortniteAPI.login().then(() => {
        fortniteAPI
            .getFortnitePVEInfo("es")
            .then(pveInfo => {
                //console.log(pveInfo.theaters[3].tiles[11]);
                //console.log(pveInfo.missions[0].availableMissions);
                pveInfo.missionAlerts.forEach( com =>{
                //pveInfo.missions.forEach( com =>{
                    //if(com.canBeMissionAlert){
                        const embed = new Discord.RichEmbed();
                        embed.setColor("#FF8000");
                        //console.log(com);
                        var titulo
                        
                        
                        com.availableMissionAlerts.forEach(com2 => {
                        //com.availableMissions.forEach(com2 => {
                            //console.log(com2);
                            //console.log(pveInfo.missions[0].availableMissions.find("missionGuid", com2. missionAlertGuid));
                            return;
                            var mensaje = "";
                            const separador = com2.name.split("_");
                            if(separador[1] === "MiniBossCategory"){
                                //console.log(com2);
                                //console.log(separador[2]);
                                if(separador[2]) titulo =  separador[2];
                               
                                com2.missionAlertRewards.items.forEach(com3 =>{
                                    const separador2 = com3.itemType.split(":");

                                    const emoji = client.emojis.find("name", separador2[1]);
                                    if(emoji){
                                        mensaje += `${emoji}(x`+com3.quantity+") ";
                                    } else {
                                        mensaje += ":"+separador2[1]+": (x"+com3.quantity+") ";
                                    }
                                    
                                });
                                
                                embed.addField(separador[1], mensaje);
                                //console.log(mensaje);
                            }

                        });
                        if(titulo){
                            if(titulo == "01"){
                                embed.setTitle("STONEWOOD");
                                //console.log(com)
                            } else if(titulo == "02"){
                                embed.setTitle("PLANKERTON");
                            } else if(titulo == "03"){
                                embed.setTitle("CANNY VALLEY");
                            } else if(titulo == "04"){
                                embed.setTitle("TWINE PEAKS");
                            }
                            //message.channel.send({embed});
                        }
                        
                    //}
                });
            
        })
        .catch(err => {
            console.log(err);
        });
    });


    




    /*if(args.lenght >=1){
        console.log("test :D");
        if(args[0] === "")
    } else {
        embed.setTitle("Necesitas añadir mas parametros. !fnt <news|stats>");
    }*/
    
}

module.exports.help = {
    name: "test",
    description: ".",
    hidden: true,
    require: false,
    admin: true,
    mod: false,
    test: true
}