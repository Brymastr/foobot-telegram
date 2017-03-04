// Keyboards
keyboard: [[{
  text: 'Link my condo account',
  request_contact: true
}]];

keyboard: [[{
  text: "Here's my location!",
  request_location: true
}]];

inline_keyboard: [[{
  text: 'Login to Facebook',
  url: `${config.url}/auth/facebook/telegram/${message.user_id}/${message.chat_id}`
}]];