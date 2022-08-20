require('dotenv').config()
const tmi = require('tmi.js');
const generator = require('./textGenerator');


console.log(process.env.TWITCH_OAUTH_TOKEN);
const reputation ={};
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [process.env.TWITCH_CHANNEL_NAME]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  if(self || !message.startsWith('!')) {
    return;
  }

  const args = message.slice(1).split(' ');
  const command = args.shift().toLowerCase();

  if(command === 'hello') {
    client.say(channel, `@${tags.username}, Yo what's up`);
  } else {
    (async () => {
      const prompt = args.join(' ');
      client.say(channel, `@${tags.username}, ${await generator.generate(prompt)}`);
    })();
  }
});