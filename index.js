import { config } from "dotenv";
import { Client, IntentsBitField } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";

config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on("ready", () => {
    console.log("Bot is up!");
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;


    try{
        await message.channel.sendTyping();

        let mode = 'friendly';

        if(message.content.startsWith('!')){
            if(message.content === '!clean'){
                return;
            }
            else if(message.content.startsWith('!mode')){
                return;
            }
            else if(message.content === '!help'){
                message.reply('This is a chatbot that uses OpenAI\'s GPT-3 API. You can talk to it like you would a human. It will respond to you in a similar way. You can also use the following commands: \n```!clean - Clears the conversation log.\n!mode - Select the mode in which the robot will answer your questions ["friendly", "technical", "creative", ...]\n!help - Displays this message. ```');
                return;
            }
        } else{
            let conversation_log = [{ role: 'system', content: `You are a ${mode} robot` }];
            let prev_messages = await message.channel.messages.fetch({
                limit: 100,
            });
    
            prev_messages = prev_messages.reverse().filter((m) => 
                m.author.id === client.user.id || m.author.id === message.author.id
            )
    
            prev_messages.forEach((m) => {
                if(m.content.startsWith('!')){
                    if(m.content.startsWith('!mode')){
                        mode = m.content.split(' ')[1];
                        conversation_log[0] = { role: 'system', content: `You are a ${mode} robot` };
                    }
                    else if (m.content === '!clean'){
                        conversation_log = [
                            { role: 'system', content: `You are a ${mode} robot` }
                        ];
                    }
                }
                else{
                    if(m.content === "Sorry, I'm having trouble connecting to the server right now. Please try again later."){
                        conversation_log === conversation_log.slice(0, -1);
                    }
                    else{
                        conversation_log.push({
                            role: m.author.id === client.user.id ? 'bot' : 'user',
                            content: m.content
                        });
                    }
                }
            });
            const result = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: conversation_log,
            }).catch((err) => {
                console.log(`OPENAI Error: ${err}`);
                message.reply('Sorry, I\'m having trouble connecting to the server right now. Please try again later.');
            });
    
            message.reply(result.data.choices[0].message)
        }
    } catch (err) {
        console.log(`Error: ${err}`);
    }
});

client.login(DISCORD_TOKEN);

