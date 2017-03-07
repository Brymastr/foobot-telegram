const
 request = require('request-promise-native'),
 rabbit = require('./rabbit');

// Send with typing
exports.send = message => new Promise(resolve => {
  this.sendTyping(message)
    .then(() => this.sendMessage(message))
    .then(resolve);
});

// Send a message
exports.sendMessage = message => new Promise(resolve => {
  request.post(`${config.telegram_url}${config.telegram_token}/sendMessage`, {
    json: {
      chat_id: message.chat_id,
      text: message.response,
      reply_markup: makeKeyboard(message.keyboard),
      parse_mode: 'Markdown'
    }
  })
  .then(resolve)
  .catch(console.warn);
});

function makeKeyboard(markup) {
  let keyboard = {
    resize_keyboard: true,
    one_time_keyboard: true
  };
  if(markup[0][0].type === 'account_link') {
    keyboard.inline_keyboard = markup.map(makeButtons);
  } else {
    keyboard.keyboard = markup.map(makeButtons);
  }
  return keyboard;
}

function makeButtons(keyboardRow) {
  let response = [];
  for(let j = 0; j < keyboardRow.length; j++) {
    let currentButton = keyboardRow[j];
    let button = {
      text: currentButton.text
    };
    if(currentButton.data) button.callback_data = currentButton.data;
    if(currentButton.url) button.url = currentButton.url;
    switch(currentButton.type) {
      case 'request_contact':
        button.request_contact = true;
        break;
      case 'request_location':
        button.request_location = true;
        break;
      case 'account_link':
        button.url = currentButton.url;
        break;
    }
    response.push(button);
  }
  return response;
}

exports.sendTyping = message => new Promise((resolve, reject) => {
  request.post(`${config.telegram_url}${config.telegram_token}/sendChatAction`, {
    json: {
      chat_id: message.chat_id,
      action: 'typing'
    }
  }).then(body => {
    let length = message.response.length;
    let delay = Math.random() * 2;
    let timeout = (0.02 * length + delay) * 1000;
    setTimeout(resolve, timeout);
  });
});

exports.editMessage = message => new Promise(resolve => {
  request.post(`${config.telegram_url}${config.telegram_token}/editMessageText`, {
    json: {
      chat_id: message.chat_id,
      text: message.text,
      parse_mode: 'Markdown'
    }
  }).then(resolve);
});

// Set the webhook so that messages are sent to this api
exports.setWebhook = address => new Promise((resolve, reject) => {
  let formData;
  const url = `${address.url}/webhook/telegram/${address.route_token}`;
  
  request.post({
    url: `${config.telegram_url}${config.telegram_token}/setWebhook?allowed_updates=["message", "edited_message"]`,
    formData: {url}
  }).then(body => {
    console.log(`Telegram webhook set: ${url}`);
    resolve(body);
  }).catch(err => {
    console.error(err.message);
    reject(err);
  });
  
});

exports.leaveChat = chat_id => new Promise((resolve, reject) => {
  request.post(`${config.telegram_url}${config.telegram_token}/leaveChat`, {
    json: { chat_id }
  })
    .then(resolve)
    .catch(reject)
});

exports.process = (connection, message) => {
  if(message._id) {
    if(message.response || message.keyboard.length > 0)
      this.send(message);
  } else {
    this.normalize(message).then(m => {
      rabbit.pub(connection, 'internal.message.nlp', m);
    });
  }
}


// Make the message into a local message without nulls
exports.normalize = update => {
  let message = {
    update_id: update.update_id,
    text: '',
    source: 'telegram'
  };
  if(update.edited_message) {
    update = update.edited_message;
    message.action = 'edit';
  }
  else if(update.message) update = update.message;

  message.message_id = update.message_id;
  message.date = update.date;
  message.platform_from = update.from;
  message.text = update.text;
  if(update.chat) {
    message.chat_id = update.chat.id;
    message.chat_name = update.chat.first_name;
  }
  if(update.contact) {
    message.text = update.contact.phone_number;
    message.action = 'contact';
    message.other = {contact_telegram_id: update.contact.user_id}
  }

  return Promise.resolve(message);
}