const 
  rewire = require('rewire'),
  telegram = rewire('../telegram'),
  assert = require('assert');

describe('telegram', function() {
  describe('#makeKeyboard()', function() {
    const makeKeyboard = telegram.__get__('makeKeyboard');
    
    it('should return a valid telegram contact keyboard', () => {
      let expected = [[{
        text: 'Link my condo account',
        request_contact: true
      }]];

      let markup = [[{
        type: 'request_contact',
        text: 'Link my condo account'
      }]];

      assert.deepEqual(expected, makeKeyboard(markup));
    });

    it('should return a valid telegram location keyboard', () => {
      let expected = [[{
        text: "Here's my location!",
        request_location: true
      }]];

      let markup = [[{
        type: 'request_location',
        text: "Here's my location!"
      }]];

      assert.deepEqual(expected, makeKeyboard(markup));
    });

    it('should return a valid telegram complex keyboard', () => {
      let expected = [[{
        text: "First button",
        url: 'https://first.row.com'
      }, {
        text: "Second button",
        url: 'https://first.row.com'
      }], [{
        text: "Third button",
        url: 'https://first.row.com'
      }, {
        text: "Fourth button",
        callback_data: "some callback data"
      }]];

      let markup = [[{
        text: "First button",
        url: 'https://first.row.com'
      }, {
        text: "Second button",
        url: 'https://first.row.com'
      }], [{
        text: "Third button",
        url: 'https://first.row.com'
      }, {
        text: "Fourth button",
        data: "some callback data"
      }]];

      assert.deepEqual(expected, makeKeyboard(markup));
    });

    it('should return a facebook login inline keyboard', () => {
      let expected = [[{
        text: 'Login to Facebook',
        url: `https://bots.facebook.com/auth/facebook/messenger/74534685338/7849233289472`,
      }]];

      let markup = [[{
        type: 'account_link',
        text: 'Login to Facebook',
        url: `https://bots.facebook.com/auth/facebook/messenger/74534685338/7849233289472`,
        data: null
      }]];
    });

  });
});