module.exports.run = async (client,message,args) =>{
    let users = client.users;

    let searchTerm = args[0];
    if(!searchTerm) return message.channel.send("Porfavor, introduzda un termino para buscar.");

    let matches = users.filter(u => u.tag.toLowerCase().includes(searchTerm.toLowerCase()));

    message.channel.send(matches.map(u => u.tag));
}

module.exports.help = {
    name: "finduser",
    description: ".",
    hidden: true,
    require: false,
    admin: false,
    mod: false,
    test: false
}