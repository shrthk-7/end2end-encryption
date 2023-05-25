const crypto = require("crypto");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 512,
});

const exportedPublicKey = publicKey.export({
  type: "spki",
  format: "pem",
});

const encryptData = (_data, _publicKey) => {
  return crypto
    .publicEncrypt(_publicKey, Buffer.from(_data))
    .toString("base64");
};

const decryptData = (_encryptedData) => {
  return crypto.privateDecrypt(privateKey, _encryptedData);
};

module.exports = {
  publicKey: exportedPublicKey,
  encryptData,
  decryptData,
};
