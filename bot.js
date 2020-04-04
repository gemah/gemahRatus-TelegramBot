/*
 * Gemah Ratus - A simple telegram bot.
 * By Gemah - 2020
 */

// APIs and Packages used
const telegramBot = require("node-telegram-bot-api"); // Telegram Bot API for Node.JS
require("dotenv").config(); // dotenv - Manages envinroment variables

// Global Constants
const BOT_TOKEN = process.env.TELEGRAM_API_BOT_TOKEN;
const CHOICE_SEPARATORS = ["|", ":", " "];
const CHOICE_FLAVOR_TEXT = [
    { first: "I choose ", second: "." },
    { first: "", second: " sounds better for me!" },
    { first: "IT'S TIME TO DECIDE. ", second: " has been chosen." },
    { first: "You're crazy if you don't pick ", second: "!" },
    { first: "I dunno... ", second: " maybe?" },
];
const CONVERT_VALID_UNITS = {
    temperature: ["celsius", "c", "farenheit", "f", "kelvin", "k"],
    measure: [
        "centimeter",
        "cm",
        "meter",
        "m",
        "kilometer",
        "km",
        "inches",
        "in",
        "feet",
        "ft",
    ],
};
const DATE_TIME_FORMAT_OPTIONS = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
};

// const PATTERN_ECHO_COMMAND = /^\/echo (.+)/i;
const PATTERN_CHOOSE_COMMAND = /^\/choose (.+)$/i;
const PATTERN_CONVERT_COMMAND = /^\/convert (.+) (.+) (.+)$/i;
const PATTERN_HELP_COMMAND = /^\/help$/i;
const PATTERN_TIME_COMMAND = /^\/time$/i;
const PATTERN_TIMEZONE_COMMAND = /^\/time (.+)$/i;
const PATTERN_MENTION_ONLY = /^(@GemahRatusBot)$/;

// Global variables

let bot = new telegramBot(BOT_TOKEN, { polling: true });
let dateFormatter = new Intl.DateTimeFormat("en-US", DATE_TIME_FORMAT_OPTIONS);

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
bot.onText(PATTERN_HELP_COMMAND, (msg) => {
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
bot.onText(PATTERN_TIME_COMMAND, (msg) => {
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
    const response = "The time where I live is: " + dateFormatter.format(now);

    // Sends a reply echoing the message
    bot.sendMessage(chatId, response);
});

// Time: Requests local time with timezone offset
bot.onText(PATTERN_TIMEZONE_COMMAND, (msg, match) => {
    const chatId = msg.chat.id;
    const timezoneOffset = parseInt(match[1]);

    // Console Log
    console.log(
        "Time Request: Offset time " +
            timezoneOffset +
            ", from user " +
            msg.from.username +
            ":" +
            msg.from.id +
            "; Chat: " +
            chatId
    );

    let response;

    if (isNaN(timezoneOffset)) {
        response =
            "I can't work with this. Can you try asking again?  only consider hours for now...";
    } else if (timezoneOffset < -12 || timezoneOffset > 14) {
        response =
            "This offset makes no sense!" +
            (timezoneOffset > 14
                ? " This value is too high!"
                : " This value is too low...");
    } else {
        let offsetDate = new Date();
        try {
            offsetDate.setHours(
                offsetDate.getHours() +
                    timezoneOffset +
                    offsetDate.getTimezoneOffset() / 60
            );
            response =
                "The time (UTC " +
                (timezoneOffset > 0 ? "+" : "") +
                timezoneOffset.toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                }) +
                ":00) is: " +
                dateFormatter.format(offsetDate);
        } catch (e) {
            console.log(e.message);
        }
    }

    // Sends a reply echoing the message
    bot.sendMessage(chatId, response);
});

// Listen for choices
bot.onText(PATTERN_CHOOSE_COMMAND, (msg, match) => {
    const chatId = msg.chat.id;
    const options = match[1];

    // Console Log
    console.log(
        "Choice Request: Choose between " +
            options +
            ", from user " +
            msg.from.username +
            ":" +
            msg.from.id +
            "; Chat: " +
            chatId
    );

    let response;
    let splitOptions;

    if (options.includes(CHOICE_SEPARATORS[0])) {
        splitOptions = options.split(CHOICE_SEPARATORS[0]);
    } else if (options.includes(CHOICE_SEPARATORS[1])) {
        splitOptions = options.split(CHOICE_SEPARATORS[1]);
    } else if (options.includes(CHOICE_SEPARATORS[2])) {
        splitOptions = options.split(CHOICE_SEPARATORS[2]);
    } else {
        splitOptions = [null, null];
    }

    const optionA = splitOptions[0];
    const optionB = splitOptions[1];

    if (optionA === null || optionB === null) {
        response =
            "I can't choose anything. I need the options to be separated by either: \"" +
            CHOICE_SEPARATORS[0] +
            '", "' +
            CHOICE_SEPARATORS[1] +
            '" or a white space';
    } else {
        const choosenOption = Math.floor(Math.random() * 2);
        const currentFlavorText = Math.floor(Math.random() * 5);
        response =
            CHOICE_FLAVOR_TEXT[currentFlavorText].first +
            (choosenOption < 1 ? optionA : optionB) +
            CHOICE_FLAVOR_TEXT[currentFlavorText].second;
    }

    bot.sendMessage(chatId, response);
});

// Listen for convert command
bot.onText(PATTERN_CONVERT_COMMAND, (msg, match) => {
    const chatId = msg.chat.id;
    const userRequestedValue = match[1];
    const unitFrom = match[2];
    const unitTo = match[3];

    // Console Log
    console.log(
        "Choice Request: Convert " +
            userRequestedValue +
            unitFrom +
            " to " +
            unitTo +
            ", from user " +
            msg.from.username +
            ":" +
            msg.from.id +
            "; Chat: " +
            chatId
    );

    let response;
    const parsedValue = parseInt(userRequestedValue);

    if (isNaN(parsedValue)) {
        response =
            "I cannot convert this value. Did you tell me correctly?\n" +
            "I need a value and unit from to: <value> <unit from> <unit to>";
    }

    const from = unitFrom.toLowerCase();
    const to = unitTo.toLowerCase();

    if (
        !CONVERT_VALID_UNITS.measure.includes(from) &&
        !CONVERT_VALID_UNITS.temperature.includes(from) &&
        !CONVERT_VALID_UNITS.measure.includes(to) &&
        !CONVERT_VALID_UNITS.temperature.includes(to)
    ) {
        response = "I cannot convert to one of these units you told me.";
    } else {
        let convertedValue;
        let unitShortName;

        // Temperature conversion
        if (
            CONVERT_VALID_UNITS.temperature.includes(from) &&
            CONVERT_VALID_UNITS.temperature.includes(to)
        ) {
            const temperatures = CONVERT_VALID_UNITS.temperature;

            // C to K
            if (
                (from === temperatures[0] || from === temperatures[1]) &&
                (to === temperatures[4] || to === temperatures[5])
            ) {
                convertedValue = parsedValue + 273.15;
                unitShortName = temperatures[5].toUpperCase();
            }

            // K to C
            if (
                (from === temperatures[4] || from === temperatures[5]) &&
                (to === temperatures[0] || to === temperatures[1])
            ) {
                convertedValue = parsedValue - 273.15;
                unitShortName = temperatures[1].toUpperCase();
            }

            // C to F
            if (
                (from === temperatures[0] || from === temperatures[1]) &&
                (to === temperatures[2] || to === temperatures[3])
            ) {
                convertedValue = parsedValue * 1.8 + 32;
                unitShortName = temperatures[3].toUpperCase();
            }

            // F to C
            if (
                (from === temperatures[2] || from === temperatures[3]) &&
                (to === temperatures[0] || to === temperatures[1])
            ) {
                convertedValue = (parsedValue - 32) / 1.8;
                unitShortName = temperatures[1].toUpperCase();
            }

            // K to F
            if (
                (from === temperatures[4] || from === temperatures[5]) &&
                (to === temperatures[2] || to === temperatures[3])
            ) {
                convertedValue = (parsedValue - 273.15) * 1.8 + 32;
                unitShortName = temperatures[3].toUpperCase();
            }

            // F to K
            if (
                (from === temperatures[2] || from === temperatures[3]) &&
                (to === temperatures[4] || to === temperatures[5])
            ) {
                convertedValue = (parsedValue - 32) / 1.8 + 273.15;
                unitShortName = temperatures[5].toUpperCase();
            }

            response =
                "The converted temperature is " +
                (Math.round(convertedValue * 100) / 100).toFixed(2) +
                unitShortName;
        } else if (
            CONVERT_VALID_UNITS.measure.includes(from) &&
            CONVERT_VALID_UNITS.measure.includes(to)
        ) {
            const measures = CONVERT_VALID_UNITS.measure;

            // TODO measure conversion
        } else {
            response = "I cannot convert between different types of unit.";
        }
    }

    bot.sendMessage(chatId, response);
});

// Listen for messages with a mention
bot.onText(PATTERN_MENTION_ONLY, (msg) => {
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
