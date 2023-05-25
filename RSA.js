const crypto = require("crypto");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
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
  return crypto
    .privateDecrypt(privateKey, Buffer.from(_encryptedData, "base64"))
    .toString();
};

module.exports = {
  publicKey: exportedPublicKey,
  encryptData,
  decryptData,
};
