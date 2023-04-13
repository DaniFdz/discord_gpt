import { generateLogs } from "./GenerateLogs.js";

const _generateCompletion = async (model, logs) => {
    const result = await model.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: logs
    }).catch((err) => {
        console.log(`OPENAI Error: ${err}`);
        throw err;
    });
    return result
}

export const generateCompletion = async (message, openai) => {
    
    const prev_messages = await message.channel.messages.fetch({
        limit: 100,
    });
    const conversation_log = generateLogs(prev_messages, message.author.id);
    try {
        const result = await _generateCompletion(openai, conversation_log);
        message.reply(result.data.choices[0].message)
    } catch (err) {
        if(conversation_log[conversation_log.length - 1].content !== "Sorry, I'm having trouble connecting to the server right now. Please try again later.")
            message.reply("Sorry, I\'m having trouble connecting to the server right now. Please try again later.");
    }

};