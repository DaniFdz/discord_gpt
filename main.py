#!/usr/bin/env python3

"""
Discord bot for the server
"""

import discord
import time
import cohere

from decouple import config

DISCORD_TOKEN = config('DISCORD_TOKEN')
COHERE_API_TOKEN = config('COHERE_API_TOKEN')

co = cohere.Client(COHERE_API_TOKEN)

client = discord.Client(
    intents=discord.Intents(
        guilds=True,
        guild_messages=True,
        message_content=True
    )
)

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

@client.event
async def on_message(message):
    # Ignore messages from the bot itself
    if message.author == client.user:
        return
    # Ignore messages that don't start with the command prefix
    if message.content.startswith('/generate'):
        m = message.content.replace('/generate', '')
        async with message.channel.typing():
            response = co.generate(
                model='command-xlarge-20221108',
                prompt=m,
                max_tokens=1200,
                temperature=0.9,
                k=0,
                stop_sequences=[],
                return_likelihoods='NONE'
            )
            await message.channel.send(response.generations[0].text)


client.run(DISCORD_TOKEN)