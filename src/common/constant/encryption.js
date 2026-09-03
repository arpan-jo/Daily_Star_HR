import { secretKey } from '../../../App';
const CryptoJS = require('crypto-js');

const key = CryptoJS.enc.Utf8.parse(secretKey);
const iv = CryptoJS.enc.Utf8.parse(secretKey);

export const makeEncryption = data => {
  const plainText = typeof data === 'string' ? data : JSON.stringify(data);

  return CryptoJS.AES.encrypt(plainText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};

export const makeDecryption = cipherText => {
  const bytes = CryptoJS.AES.decrypt(cipherText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  // Try to parse JSON; if it isn't JSON, return the string.
  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
};
