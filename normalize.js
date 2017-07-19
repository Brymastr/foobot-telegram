module.exports = function(update) {

  let message;

  if(update.edited_message) {
    message = edited(update);
  } else if(update.message !== undefined) {
    if(update.message.text !== undefined) {
      message = text(update);
    }
  } else {
    message = null;
  }

  return message;
};

function text(update) {
  // Is the message from a group?
  const is_group = update.message.chat.id !== update.message.from.id;

  return {
    text: update.message.text,
    date: update.message.date,
    user_id: update.message.from.id,
    group_id: is_group ? update.message.chat.id : null,
    is_group,
    platform: 'telegram',
    user_info: {  // This part isn't saved in the messages service, only in the users service
      first_name: update.message.from.first_name,
      last_name: update.message.from.last_name,
      username: update.message.from.username
    }
  }
}

function edited(message) {
  // Do nothing for now
  return null;
}

function contact(message) {

}