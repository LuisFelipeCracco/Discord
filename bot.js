const { Client, GatewayIntentBits, Partials } = require('discord.js');
// Cria um mapa para armazenar o tempo total de cada usuário no canal de voz
const voiceTime = new Map();
let tempoTotal = null;


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
            }
        }
        if(!message.member.roles.cache.some(role => role.name === 'staff')){
            //console.log(`vc não é staff`);
            message.channel.send(`vc não é staff`);
        }
    }//
  
});

//



/*
client.on('voiceStateUpdate', (oldState, newState) => {
    // Verifica se o usuário entrou em um canal de voz
    if (oldState.channelId === null && newState.channelId !== null) {
      // Armazena a hora atual como o momento em que o usuário entrou no canal
      voiceTime.set(newState.id, Date.now());
    }
    // Verifica se o usuário saiu de um canal de voz
    if (oldState.channelId !== null && newState.channelId === null) {
      // Calcula o tempo total do usuário no canal
      const totalTime = Date.now() + voiceTime.get(oldState.id);
      // Adiciona o tempo total do usuário no canal ao tempo total armazenado
      const previousTime = voiceTime.get(oldState.id) || 0;
      voiceTime.set(oldState.id, previousTime + totalTime);
    }
  });
  
  client.on('messageCreate', message => {
    // Verifica se a mensagem é a palavra "tempo"
    if (message.content === 'tempo') {
      // Busca o tempo total do usuário no mapa
      const totalTime = voiceTime.get(message.author.id);
      // Verifica se o usuário já passou tempo em um canal de voz
      if (totalTime) {
        // Calcula o tempo em horas, minutos e segundos
        const hours = Math.floor(totalTime / 1000 / 60 / 60);
        const minutes = Math.floor((totalTime / 1000 / 60) % 60);
        const seconds = Math.floor((totalTime / 1000) % 60);
        // Envia uma mensagem para o canal com o tempo total do usuário
        message.channel.send(
          `Você ficou ${hours} horas, ${minutes} minutos e ${seconds} segundos em canais de voz.`
        );
      } else {
        // Envia uma mensagem para o canal informando que o usuário não passou tempo em um canal de voz
        message.channel.send('Você ainda não passou tempo em um canal de voz.');
      }
    }
  });
*/





client.login('MTA1NzYxMDcwMzUzMzUxMDcxNw.G2bn-B.2rRka6vkmvoXeBo32Eb568fIqC3ehZ9TLKiT6o');