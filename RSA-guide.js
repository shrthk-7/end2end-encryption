const crypto = require("crypto");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 512,
});

/*
	OF THE FORM:

	-----BEGIN PUBLIC KEY-----
	<public key>
	-----END PUBLIC KEY-----

*/

const exportedPublicKey = publicKey.export({
  type: "spki",
  format: "pem",
});

const importantData = "hello world";
const encryptedData = crypto.publicEncrypt(
  exportedPublicKey,
  Buffer.from(importantData)
);

const decryptedData = crypto.privateDecrypt(privateKey, encryptedData);
console.log(decryptedData.toString());
