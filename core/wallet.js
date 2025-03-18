const CryptoJS = require("crypto-js");
const DEFAULT_PASSWORDLENGTH = 8;

const aesEncrypt = (message, key) => {
  const iv = CryptoJS.enc.Utf8.parse(key);
  key = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(message), key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return Buffer.from(encrypted.toString()).toString("base64");
};

const decryptByDES = (ciphertext, key) => {
  const iv = CryptoJS.enc.Utf8.parse(key);
  key = CryptoJS.enc.Utf8.parse(key);
  ciphertext = Buffer.from(ciphertext,"base64").toString();
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const aesCreate = async (msg) => {
  const seed = await ranStr(DEFAULT_PASSWORDLENGTH);
  const ret = await aesEncrypt(msg, seed);
  return {
    data: ret,
    key: seed,
  };
};

const ranStr = async (length) => {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};


module.exports = { aesEncrypt,decryptByDES,aesCreate, ranStr };
