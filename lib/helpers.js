const config = require('./config');
const crypto = require('crypto');
const https = require('https');

const helpers = {};

helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

helpers.hash = (str) => {
  if (typeof (str) == 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

helpers.createRandonString = (stringLength) => {
  stringLength = typeof (stringLength) == 'number' && stringLength > 0 ? stringLength : false;
  if (stringLength) {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (i = 1; i <= stringLength; i++) {
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
};

helpers.sendTwilioSms = (phone, message, callback) => {
  phone = typeof (phone) === 'string' && phone.trim().length >= 10 ? phone.trim() : false;
  message = typeof (message) === 'string' && message.trim().length > 0 && message.trim().length <= 1600 ? message.trim() : false;

  if (phone && message) {
    const payload = {
      'From': config.twilio.fromPhone,
      'To': `+1${phone}`,
      'Body': message
    }

    const stringPayload = new URLSearchParams(payload).toString();
    console.log('stringPayload2', stringPayload);

    const requestDetails = {
      'protocol': 'https:',
      'hostname': 'api.twilio.com',
      'method': 'POST',
      'path': `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
      'auth': `${config.twilio.accountSid}:${config.twilio.authToken}`,
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload.toString())
      }
    }
    
    const req = https.request(requestDetails, (res) => {
      const status = res.statusCode;
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback(`Status code returned was ${status}`);
      }
    });
    
    req.on('error', (e) => {
      callback(e)
    });
    req.write(stringPayload);
    req.end();
  } else {
    callback('Given parameter were missing or invalid')
  }
};

module.exports = helpers;