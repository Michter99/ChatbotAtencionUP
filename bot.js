// Import statements should be at the top of the module
import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import getCompletion from "./chatbot.mjs"; // Assuming you've named the module with a .mjs extension

config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  const gptResponse = await getCompletion(userMessage);
  bot.sendMessage(chatId, gptResponse);
});

console.log("Bot has started. Send a message in Telegram to interact!");
