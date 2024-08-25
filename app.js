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

// /secret
bot.onText(/\/secret/, (msg) => {
    bot.sendMessage(msg.chat.id, 'The most “secret” secret of programming might be that no one knows everything. Even the most experienced programmers encounter bugs, get stuck, and have to Google solutions. Programming is a continuous learning process, and the real secret is persistence, curiosity, and the willingness to keep learning and improving.');
});

console.log('the bot is working...');
