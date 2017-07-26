const
  assert = require('assert'),
  rewire = require('rewire');

const telegramMessageFormat = {
  update_id: 124559694,
  message: { 
    message_id: 313,
    from: {
      id: 102330327,
      first_name: 'Brycen',
      last_name: 'Dorsay',
      username: 'Brycen',
      language_code: 'en-US'
    },
    chat: {
      id: 102330327,
      first_name: 'Brycen',
      last_name: 'Dorsay',
      username: 'Brycen',
      type: 'private'
    },
    date: 1501003052,
    text: 'hey'
  }
}

describe('normalize', function() {
  const normalize = rewire('../normalize');
  
  describe('#text()', function() {
    const text = normalize.__get__('text');

    it(`should return a valid normalized message if text message is not from a group`, function() {
      const message = {
        update_id: 124559694,
        message: { 
          message_id: 313,
          from: {
            id: 102330327,
            first_name: 'Brycen',
            last_name: 'Dorsay',
            username: 'bbbbbbb',
            language_code: 'en-US'
          },
          chat: {
            id: 102330327,
            first_name: 'Brycen',
            last_name: 'Dorsay',
            username: 'Brycen',
            type: 'private'
          },
          date: 1501003052,
          text: 'hey'
        }
      };

      const expected = {
        text: 'hey',
        date: 1501003052,
        user_id: 102330327,
        group_id: null,
        is_group: false,
        platform: 'telegram',
        user_info: {
          first_name: 'Brycen',
          last_name: 'Dorsay',
          username: 'bbbbbbb'
        }
      }

      const response = text(message);
      assert.deepEqual(expected, response);
    });

    it(`should return a valid normalized message if text message is from a group`, function() {
      const message = {
        update_id: 124559694,
        message: { 
          message_id: 313,
          from: {
            id: 102330327,
            first_name: 'Brycen',
            last_name: 'Dorsay',
            username: 'bbbbbbb',
            language_code: 'en-US'
          },
          chat: {
            id: 784937539,
            first_name: 'Brycen',
            last_name: 'Dorsay',
            username: 'Brycen',
            type: 'private'
          },
          date: 1501003052,
          text: 'hey'
        }
        };

      const expected = {
        text: 'hey',
        date: 1501003052,
        user_id: 102330327,
        group_id: 784937539,
        is_group: true,
        platform: 'telegram',
        user_info: {
          first_name: 'Brycen',
          last_name: 'Dorsay',
          username: 'bbbbbbb'
        }
      }

      const response = text(message);
      assert.deepEqual(expected, response);
    });

  });
});