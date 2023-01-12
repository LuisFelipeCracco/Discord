const { Client, GatewayIntentBits, Partials } = require('discord.js');
// Cria um mapa para armazenar o tempo total de cada usuário no canal de voz
const voiceTime = new Map();
let tempoTotal = null;
let totalUnico = new Map();


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        
    ],
    partials: [
        Partials.Message,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.User,
        Partials.Channel,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ],
});








client.on('ready', () => {
    console.log('O bot está no ar!');
});

client.on('messageCreate', (message) => {
    if(message.author.bot) return;

    if(message.content === 'ping') message.channel.send(`O ping do bot é de estimados ${client.ws.ping}ms`);
});

client.on('messageCreate', mensagem => {
    if (mensagem.content === 'data') {
        
        const date = new Date(); //variavel com a data atual

        const dataFormatada = date.toLocaleDateString('pt-BR', {//formata a data para dd/mm/yyyy
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        mensagem.channel.send(`A data atual é ${dataFormatada}`);//envia a data para o canal
    }
    if (mensagem.content === 'chora') {
        // Agenda a execução da função de apagar a mensagem após 3 segundos
        setTimeout(() => {
          mensagem.delete();
        }, 3000);
      }

    
      
});

//






client.on('voiceStateUpdate', (oldState, newState) => {

    if (newState.member.roles.cache.some(role => role.name === 'staff')) {

        // Verifica se o usuário entrou em um canal de voz
        if (oldState.channelId === null && newState.channelId !== null) {
            console.log(`o usuario entrou no canal de voz`)
            // Armazena a hora atual como o momento em que o usuário entrou no canal
            voiceTime.set(newState.id, Date.now());
            
        }
        // Verifica se o usuário saiu de um canal de voz
        if (oldState.channelId !== null && newState.channelId === null) {
            // Calcula o tempo total do usuário no canal
            console.log("saiu do canal");
            const totalTime = Date.now() - voiceTime.get(oldState.id);
            // Armazena o tempo total do usuário no mapa
            voiceTime.set(oldState.id, totalTime);
            tempoTotal = tempoTotal + totalTime;

            let tempoAtual = totalUnico.get(oldState.id);
            console.log(`${oldState.id} id do usuariooooo00 ${tempoAtual}`);

            if(tempoAtual === 'undefined' || 'NaN'){
                totalUnico.set(oldState.id, totalTime);
            }
            if(tempoAtual > 1)
            {
                totalUnico.set(oldState.id, tempoAtual + totalTime);
            }

            //totalUnico.set(oldState.id, )
        }

    }else{
        console.log('não tem')
    }

});






client.on('messageCreate', message => {
  // Verifica se a mensagem é a palavra "tempo"
  
    if (message.content === 'tempo') {
        if (message.member.roles.cache.some(role => role.name === 'staff')){
            // Busca o tempo total do usuário no mapa
            const totalTime = voiceTime.get(message.author.id);
            console.log(`o usuario ${message.author.id} digitou tempo`)
            // Verifica se o usuário já passou tempo em um canal de voz
            if (totalTime) {
            // Calcula o tempo em horas, minutos e segundos
            const hours = Math.floor(totalTime / 1000 / 60 / 60);
            const minutes = Math.floor((totalTime / 1000 / 60) % 60);
            const seconds = Math.floor((totalTime / 1000) % 60);
            // Envia uma mensagem para o canal com o tempo total do usuário
            message.channel.send(
                `Você ficou ${hours} horas, ${minutes} minutos e ${seconds} segundos em um canal de voz.`
            );
            } else {
            // Envia uma mensagem para o canal informando que o usuário não passou tempo em um canal de voz
            message.channel.send('Você ainda não passou tempo em um canal de voz.');
            }
            if(tempoTotal){
                // Calcula o tempo em horas, minutos e segundos
            const hours = Math.floor(tempoTotal / 1000 / 60 / 60);
            const minutes = Math.floor((tempoTotal / 1000 / 60) % 60);
            const seconds = Math.floor((tempoTotal / 1000) % 60);
            // Envia uma mensagem para o canal com o tempo total do usuário
            message.channel.send(
                `Você ficou ${hours} horas, ${minutes} minutos e ${seconds} segundos em um canal de voz.`
            );
            console.log(`${message.author.id} id do usuariooooo`);
            console.log(`${totalUnico.get(message.author.id)} AQUIAQUIAQUI`);
            }
        }
        if(!message.member.roles.cache.some(role => role.name === 'staff')){
            //console.log(`vc não é staff`);
            message.channel.send(`vc não é staff`);
        }
    }//
  
});




client.on('messageCreate', message => {
  // verifique se a mensagem é um comando válido
  if (message.content.startsWith('!give-role')) {
    if (message.member.roles.cache.some(role => role.name === 'staff-msg')){
        // pegue o usuário mencionado e o nome do cargo
        const words = message.content.split(' ');
        const user = message.mentions.users.first();
        const roleName = words.slice(2).join(' '); // o nome do cargo é tudo o que vier depois do usuário mencionado

        // verifique se o usuário e o cargo foram encontrados
        if (!user || !roleName) {
        message.channel.send('Usuário ou cargo não encontrados. Verifique se você mencionou o usuário e especificou o nome do cargo corretamente.');
        return;
        }

        // verifique se o usuário que enviou o comando tem a permissão para conceder cargos
        if (message.member.roles.cache.some(role => role.name === 'staff-msg')) {
        // busque o cargo pelo seu nome
        const role = message.guild.roles.cache.find(r => r.name === roleName);
        // conceda o cargo ao usuário
        message.guild.members.fetch(user).then(member => {
            if (role) {
                member.roles.add(role);
                message.channel.send(`O cargo ${role.name} foi concedido ao usuário ${user.tag}.`);
            } else {
                console.error("A variável 'role' é undefined ou nula. Impossível enviar mensagem.");
                message.channel.send(`Digite somente o nome!`);
            }
        }).catch(error => {
            console.error(error);
        });
        //message.channel.send(`O cargo ${role.name} foi concedido ao usuário ${user.tag}.`);
        } else {
        message.channel.send('Você não tem permissão para conceder cargos.');
        }
  }else{
    message.channel.send(`Você não tem o cargo staff-msg!`);
  }
  }
});



client.login('MTA1NzYxMDcwMzUzMzUxMDcxNw.G2bn-B.2rRka6vkmvoXeBo32Eb568fIqC3ehZ9TLKiT6o');