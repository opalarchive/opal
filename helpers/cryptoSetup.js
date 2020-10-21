/*
 * @name cryptoSetup
 *
 * This helper sets up the CryptoJS functions (encrypt and decrypt), which allow
 * the encryption of a string into a base-64 equivalent and back.
 *
 * This uses an AES cipher (with 256 bits), and then pipes the resulting base-64
 * string into a UTF-8 string.
 *
 * The further functions convertToURL and convertFromURL help make the
 * conversion from an encrypted string into a URL-friendly string and vice
 * versa.
 *
 * For each of the functions, here are the descriptions:
 *
 * encrypt:
 *     - @param val: The value to be encoded into a UTF-8 String
 *
 * decrypt:
 *     - @param encrypted: The encrypted string to be decrypted
 *
 * convertToURL:
 *     - @param toEncrypt: The value to encrypt and then made URL friendly
 *
 * convertFromURL:
 *     - @param toDecrypt: The value to decrypt after changing into base-64
 *
 * @author Amol Rama
 * @since October 20, 2020
 */


/*
 * Get the environment variables. In this instance, we need the following:
 *     - ENCRYPTION_KEY
 *     - ENCRYPTION_IV
 * In addition, get the CryptoJS module
 */
const env = require('./envSetup');
const crypto = require('crypto');

const encrypt = ((val) => {
  let cipher = crypto.createCipheriv('aes-256-cbc', env.ENCRYPTION_KEY, env.ENCRYPTION_IV);
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
});

const decrypt = ((encrypted) => {
  let decipher = crypto.createDecipheriv('aes-256-cbc', env.ENCRYPTION_KEY, env.ENCRYPTION_IV);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return (decrypted + decipher.final('utf8'));
});

const convertToURL = (toEncrypt => {
  let string = encrypt(toEncrypt);
  return string.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
});

const convertFromURL = (toDecrypt => {
  let string = toDecrypt.replace(/\-/g, '+').replace(/\_/g, '\/');
  while (string.length % 4 !== 0) string += '=';
  return decrypt(string);
});

module.exports = {
  encrypt,
  decrypt,
  convertToURL,
  convertFromURL
};
