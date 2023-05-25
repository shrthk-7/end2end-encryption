const http = require("http");
const fetchData = require("./fetchData");

if (!process.argv[3]) {
  console.log(
    `sender and recipient ports must be provided: 
      node ./client.js SENDER_PORT RECIPIENT_PORT`
  );
  process.exit(1);
}

const THIS_GUY_PORT = process.argv[2];
const OTHER_GUY_PORT = process.argv[3];
const PROXY_PORT = 5005;

// --------------- RSA KEY GENERATION --------------------

const { publicKey: myPublicKey, decryptData, encryptData } = require("./RSA");

let recipientPublicKey = null;
const getRecipientPublicKey = async () => {
  recipientPublicKey = await fetchData.post({
    port: PROXY_PORT,
    path: "/public-key",
    message: JSON.stringify({
      sender: THIS_GUY_PORT,
      recipient: OTHER_GUY_PORT,
    }),
  });
};

// --------------- FOR SENDING ----------------------------

process.stdin.addListener("data", async (chunk) => {
  /*
    MESSAGE GENERATION
    1. converting buffer to string
    2. removing trailing \r\n
    3. encrypting it using the recipients publicKey
  */

  if (!recipientPublicKey) {
    await getRecipientPublicKey();
  }
  const message = encryptData(
    chunk.toString().replace(/[\r\n]/gm, ""),
    recipientPublicKey
  );

  await fetchData.post({
    port: PROXY_PORT,
    path: "/",
    message: JSON.stringify({
      message: message,
      sender: THIS_GUY_PORT,
      recipient: OTHER_GUY_PORT,
    }),
  });
});

// ------------ FOR RECEIVING ---------------------------------

const server = http.createServer();
server.listen(THIS_GUY_PORT, () => {
  console.log(`Client listening on localhost:${THIS_GUY_PORT}`);
});

server.addListener("request", (req, res) => {
  req.body = "";
  if (req.url === "/public-key" && req.method === "GET") {
    return res.end(myPublicKey);
  }

  req.addListener("data", (chunk) => {
    req.body += chunk;
  });
  req.addListener("end", () => {
    req.body = JSON.parse(req.body);
    const message = decryptData(req.body.message);
    console.log(`${req.body.sender}: ${message}`);
    res.end("Message Received");
  });
});
