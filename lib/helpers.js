const config = require('./config');
const crypto = require('crypto');

const helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = (str) => {
  if (typeof (str) == 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters of a given length
helpers.createRandonString = (stringLength) => {
  stringLength = typeof (stringLength) == 'number' && stringLength > 0 ? stringLength : false;
  if (stringLength) {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (i = 1; i <= stringLength; i++) {
      // Get a randon character from the possibleCharacters string
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
}

module.exports = helpers;