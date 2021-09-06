var config = require('./config');
var crypto = require('crypto');

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function (str) {
  if (typeof (str) == 'string' && str.length > 0) {
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters of a given length
helpers.createRandonString = function (stringLength) {
  stringLength = typeof (stringLength) == 'number' && stringLength > 0 ? stringLength : false;
  if (stringLength) {
    // Define all the possuble characters that could go into a string
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    // Start the final string
    let str = '';
    for (i = 1; i <= stringLength; i++) {
      // Get a randon character from the possibleCharacters string
      let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      // Append this character to the final string
      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
}

module.exports = helpers;