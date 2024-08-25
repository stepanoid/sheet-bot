const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

const sheetId = process.env.SHEET_ID;

// credentials
// read
const credentialsBase64 = process.env.CREDENTIALS_BASE64;
const tokenBase64 = process.env.TOKEN_BASE64;
// decode
fs.writeFileSync(path.join(__dirname, 'credentials.json'), Buffer.from(credentialsBase64, 'base64'));
fs.writeFileSync(path.join(__dirname, 'token.json'), Buffer.from(tokenBase64, 'base64'));
// write
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

// authorization link
const SCOPES = ['https://www.googleapis.com/auth/documents'];

// Auth Google API
function authorize(callback) {
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.error('Error loading client secret file:', err);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function readDocument(auth) {
  const docs = google.docs({ version: 'v1', auth });
  docs.documents.get({ documentId: sheetId }, (err, res) => {
    if (err) return console.error('The API returned an error:', err);
    const doc = res.data;
    console.log('Title:', doc.title);
    console.log('Content:', doc.body.content);
  });
}

// sheets
bot.onText(/\/getdoc/, (msg) => {
  const chatId = msg.chat.id;
  authorize((auth) => {
    readDocument(auth);
    bot.sendMessage(chatId, 'Document content has been fetched. Check console for details.');
  });
});

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
