/*
 * Gemah Ratus - A simple telegram bot.
 * By Gemah - 2020
 */

// APIs and Packages used
const telegramBot = require("node-telegram-bot-api"); // Telegram Bot API for Node.JS
require("dotenv").config(); // dotenv - Manages envinroment variables

// Global variables
const BOT_TOKEN = process.env.TELEGRAM_API_BOT_TOKEN;

// const PATTERN_ECHO_COMMAND = /^\/echo (.+)/i;
const PATTERN_HELP_COMMAND = /^\/help$/i;
const PATTERN_TIME_COMMAND = /^\/time$/i;
const PATTERN_TIMEZONE_COMMAND = /^\/time (.+)$/i;
const PATTERN_MENTION = /(@GemahRatusBot)/;

let bot = new telegramBot(BOT_TOKEN, { polling: true });

// Bot commands
/* //Example: echo = Repeats what was inputed
bot.onText(PATTERN_ECHO_COMMAND, (msg, match) => {
    const chatId = msg.chat.id;
    const response = match[1];

    // Console Log
    console.log(
        'Echo "' +
            msg.text +
            '" from user ' +
            msg.from.username +
            ":" +
            msg.from.id +
            "; Chat: " +
            chatId
    );

    // Sends a reply echoing the message
    bot.sendMessage(chatId, response);
});
*/

// Help - Describes commands and other details
bot.onText(PATTERN_HELP_COMMAND, msg => {
    const chatId = msg.chat.id;

    // Console Log
    console.log(
        "Help request from user " +
            msg.from.username +
            ":" +
            msg.from.id +
            "; Chat: " +
            chatId
    );

    // Sends a reply echoing the message
    bot.sendMessage(
        chatId,
        "H-hello. My name is Gemah Ratus. I'm just a simple bot, haha... " +
            "As of now I can help you with the following:" +
            "\n* /time [timezone]: Tells you the timezone based in an offset (e.g.: -3)"
    );
});

// Time: Requests local time
bot.onText(PATTERN_TIME_COMMAND, msg => {
    const chatId = msg.chat.id;

    // Console Log
    console.log(
        "Time Request: Local time, from user " +
            msg.from.username +
            ":" +
            msg.from.id +
            "; Chat: " +
            chatId
    );

    const now = new Date();
    const response = "The time where I live is: " + new Date().toString();

    // Sends a reply echoing the message
    bot.sendMessage(chatId, response);
});

// Time: Requests local time with timezone offset
bot.onText(PATTERN_TIMEZONE_COMMAND, (msg, match) => {
    const chatId = msg.chat.id;
    const timezoneOffset = match[1];

    // Console Log
    console.log(
        "Time Request: Local time, from user " +
            msg.from.username +
            ":" +
            msg.from.id +
            "; Chat: " +
            chatId
    );

    const offsetDateInMilli =
        new Date().getTime + parseInt(timezoneOffset) * 3600000;

    const response =
        "The time where I live is: " + new Date(offsetDateInMilli).toString();

    // Sends a reply echoing the message
    bot.sendMessage(chatId, response);
});

// Listen for messages with a mention
bot.onText(PATTERN_MENTION, msg => {
    const chatId = msg.chat.id;

    // Console Log
    console.log(
        "Mentioned by user " +
            msg.from.username +
            ":" +
            msg.from.id +
            "; Chat: " +
            chatId
    );

    bot.sendMessage(
        chatId,
        "H-Hello. Did you need anything? You can ask me what I can do with /help"
    );
});
