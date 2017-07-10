exports.normalize = update => {
  const message = {
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

  return message;
}