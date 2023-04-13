import dotenv from 'dotenv';

export const generateLogs = (prev_messages, author_id) => {
    dotenv.config();
    const BOT_ID = process.env.BOT_ID;

    let mode = 'friendly';
    let conversation_log = [{ role: 'system', content: `You are a ${mode} robot` }];

    prev_messages = prev_messages.reverse().filter((m) => 
        m.author.id === BOT_ID || m.author.id === author_id
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
            if(!m.author.id === BOT_ID ||
            !m.content === "Sorry, I'm having trouble connecting to the server right now. Please try again later."){
                conversation_log.push({
                    role: m.author.id === BOT_ID ? 'bot' : 'user',
                    content: m.content
                });
            }
        }
    });

    return conversation_log;
}