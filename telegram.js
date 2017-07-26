const
  request = require('request-promise-native'),
  uuid = require('uuid'),
  config = require('./config')(),
  { promisify } = require('util'),
  ngrok = promisify(require('ngrok').connect);


exports.send = async function(message) {
  const delay = calculateTypingTime(message.text.length);
  await sendTyping(message.chat_id);
  setTimeout(async () => {
    await this.sendMessage(message);
  }, delay);
};

exports.sendMessage = async function(message) {
  const url = `${config.TELEGRAM_URL}${config.TELEGRAM_TOKEN}/sendMessage`;
  return await request.post(url, { json: {
    chat_id: message.chat_id,
    text: message.text,
    // reply_markup: message.keyboard.length > 0 ? makeKeyboard(message.keyboard) : {},
    parse_mode: 'Markdown'
  }});
};

async function sendTyping(chat_id) {
  const url = `${config.TELEGRAM_URL}${config.TELEGRAM_TOKEN}/sendChatAction`;
  return await request.post(url, { json: {
    chat_id,
    action: 'typing'
  }});
};

function calculateTypingTime(messageLength) {
  const delay = Math.random() * 2;
  return (0.02 * messageLength + delay) * 1000;
}

exports.editMessage = async function(message) {
  const url = `${config.TELEGRAM_URL}${config.TELEGRAM_TOKEN}/editMessageText`
  return await request.post(url, { json: {
    chat_id: message.chat_id,
    text: message.text,
    parse_mode: 'Markdown'
  }});
};

exports.setWebhook = async function(address) {
  const urlOfThisService = `${address.url}/webhook/telegram/${address.route_token}`;
  const telegramUrl = `${config.TELEGRAM_URL}${config.TELEGRAM_TOKEN}/setWebhook?allowed_updates=["message", "edited_message"]`;
  const response = await request.post(telegramUrl, { formData: { url: urlOfThisService }});
  console.log(`Telegram webhook set: ${urlOfThisService}`);
  return response;
};

exports.leaveChat = async function(chat_id) {
  const url = `${config.TELEGRAM_URL}${config.TELEGRAM_TOKEN}/leaveChat`
  return await request.post(url, { json: { chat_id } });
};

exports.generateToken = function() {
  return uuid.v4();
};

exports.resetUrl = function() {
  const url = 'https://telegram.foobot.dorsaydevelopment.ca';
  process.env.TELEGRAM_FOOBOT_URL = url;
  return url;
};

exports.getMe = async function() {
  const url = `${config.TELEGRAM_URL}${config.TELEGRAM_TOKEN}/getMe`;
  const response = JSON.parse(await request.get(url));
  return {
    id: response.result.id,
    name: response.result.first_name,
    username: response.result.username
  }
};