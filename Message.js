module.exports = data => {
  this.message_id = data.message_id;
  this.text = data.text;
  this.date = data.date;
  this.user_id = ObjectId;
  this.platform_from = data;
  this.chat_id = data.chat_id;
  this.chat_name = data.chat_name;
  this.source = 'telegram';
};