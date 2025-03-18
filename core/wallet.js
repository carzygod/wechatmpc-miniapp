const CryptoJS = require("crypto-js");
const DEFAULT_PASSWORDLENGTH = 8;
const mapSeed="tbren2js1pwxjz04uomqm848nxnxcyps"

function strToHex(str) {
  let hexString = '';
  
  for (let i = 0; i < str.length; i++) {
    // 获取Unicode码点
    let codePoint = str.codePointAt(i);
    
    // 如果是代理对，跳过低代理项
    if (codePoint > 0xFFFF) {
      i++;
    }
    
    // UTF-8编码
    if (codePoint < 0x80) {
      // 1字节 (0xxxxxxx)
      hexString += codePoint.toString(16).padStart(2, '0');
    } else if (codePoint < 0x800) {
      // 2字节 (110xxxxx 10xxxxxx)
      hexString += ((0xC0 | (codePoint >> 6))).toString(16).padStart(2, '0');
      hexString += ((0x80 | (codePoint & 0x3F))).toString(16).padStart(2, '0');
    } else if (codePoint < 0x10000) {
      // 3字节 (1110xxxx 10xxxxxx 10xxxxxx)
      hexString += ((0xE0 | (codePoint >> 12))).toString(16).padStart(2, '0');
      hexString += ((0x80 | ((codePoint >> 6) & 0x3F))).toString(16).padStart(2, '0');
      hexString += ((0x80 | (codePoint & 0x3F))).toString(16).padStart(2, '0');
    } else {
      // 4字节 (11110xxx 10xxxxxx 10xxxxxx 10xxxxxx)
      hexString += ((0xF0 | (codePoint >> 18))).toString(16).padStart(2, '0');
      hexString += ((0x80 | ((codePoint >> 12) & 0x3F))).toString(16).padStart(2, '0');
      hexString += ((0x80 | ((codePoint >> 6) & 0x3F))).toString(16).padStart(2, '0');
      hexString += ((0x80 | (codePoint & 0x3F))).toString(16).padStart(2, '0');
    }
  }
  
  return hexString;
}

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

const ranStr = (length) => {
  let result = "";
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const resotreSeed= (uid,pin) =>
{
  const seed = uid+pin+mapSeed
  return strToHex(seed)
}

module.exports = { aesEncrypt,decryptByDES,aesCreate, ranStr,resotreSeed };
