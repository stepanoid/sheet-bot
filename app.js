const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Hi! I am your Bot!');
});

// /help
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Available commands: \n/start - Greeting, \n/help - List of commands');
});

console.log('the bot is working...');
