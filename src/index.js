import { config } from "dotenv";
import { Client, IntentsBitField } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";

import { generateCompletion } from "./modules/GenerateCompletion.js";

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
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on("ready", () => {
    console.log("Bot is up!");
});

client.on("messageCreate", async (message) => {
    if (message.author.bot){
        if(message.content === "Sorry, I\'m having trouble connecting to the server right now. Please try again later."){
            generateCompletion(message, openai);
        }
        else return;
    }

    try{
        await message.channel.sendTyping();

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
            generateCompletion(message, openai);
        }
    } catch (err) {
        console.log(`Error: ${err}`);
    }
});

client.login(DISCORD_TOKEN);

