'use strict';

const
 request = require('request-promise');


// Send a message
exports.sendMessage = (message, done) => {
  request.post(`${config.telegram_url}${config.telegram_token}/sendMessage`, {
    json: {
      chat_id: message.chat_id,
      text: message.response,
      reply_markup: message.reply_markup,
      reply_to_message_id: message.reply_to,
      parse_mode: 'Markdown'
    }
  }).then(body => {
    done(body);
  }).catch(console.warn);
};

exports.sendTyping = (message, done) => {
  request.post(`${config.telegram.url}${config.telegram.token}/sendChatAction`, {
    json: {
      chat_id: message.chat_id,
      action: 'typing'
    }
  }, (err, response, body) => {
    if(err) log.error(err);
    done(body);
  });  
};

exports.editMessage = (message, done) => {
  request.post(`${config.telegram.url}${config.telegram.token}/editMessageText`, {
    json: {
      chat_id: message.chat_id,
      text: message.text,
      reply_markup: message.reply_markup,
      parse_mode: 'Markdown'
    }
  }, (err, response, body) => {
    if(err) log.error(err);    
    done(body);
  });
}

// Set the webhook so that messages are sent to this api
exports.setWebhook = () => {
  let formData;
  const url = `${config.url}/webhook/telegram/${config.route_token}`;
  try {
    formData = {
      url: url,
      certificate: fs.readFileSync(config.cert_path)
    };
  } catch(err) {
    formData = {
      url: url
    };
  }
  request.post({
    url: `${config.telegram_url}${config.telegram_token}/setWebhook?allowed_updates=["message", "edited_message", "callback_query"]`,
    formData: formData
  }, (err, response, body) => {
    if(err || body.error_code) log.error(err);
    log.info(`Telegram webhook set: ${url}`);
  });
  
};

exports.leaveChat = chat_id => {
  return new Promise((resolve, reject) => {
    request.post(`${config.telegram_url}${config.telegram_token}/leaveChat`, {
      json: { chat_id }
    })
      .then(resolve)
      .catch(reject)
  });
};


// Make the message into a local message without nulls
exports.normalize = update => {
  let message = {
    update_id: update.update_id
  };
  if(update.edited_message) {
    message.message_id = update.edited_message.message_id;
    message.date = update.edited_message.date;
    message.platform_from = update.edited_message.from;
    message.chat_id = update.edited_message.chat.id;
    message.chat_name = update.edited_message.chat.first_name;
    message.action = 'edit';
  } else if(update.message) {
    message.message_id = update.message.message_id;
    message.date = update.message.date;
    message.platform_from = update.message.from;
    message.chat_id = update.message.chat.id;
    message.chat_name = update.message.chat.first_name;
    message.text = update.message.text;
    if(update.message.contact) {
      message.text = update.message.contact.phone_number;
      message.action = 'contact';
      message.other = {contact_telegram_id: update.message.contact.user_id}
    }
  } else if(update.callback_query) {
    message.message_id = update.callback_query.message.message_id;
    message.platform_from = update.callback_query.from;
    message.chat_id = update.callback_query.message.chat.id;
    message.chat_name = update.callback_query.message.chat.first_name;
    message.text = update.callback_query.message.text;
    message.action = update.callback_query.data;
  }

  if(!message.text)
    message.text = '';

  return Promise.resolve(message);
}