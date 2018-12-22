const crypto = require('crypto');

function encrypt(text) {
	var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq');
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text) {
	var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq');
	var decrypted = decipher.update(text, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}

module.exports = {decrypt, encrypt};