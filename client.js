const http = require("http");

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

// --------------- FOR SENDING ----------------------------

process.stdin.addListener("data", (chunk) => {
  const req = http.request(
    {
      host: "localhost",
      port: PROXY_PORT,
      path: "/",
      method: "POST",
    },
    (res) => {
      res.body = "";
      res.addListener("data", (chunk) => {
        res.body += chunk;
      });
    }
  );

  const message = chunk.toString().replace(/[\r\n]/gm, "");
  req.write(
    JSON.stringify({
      message: message,
      sender: THIS_GUY_PORT,
      recipient: OTHER_GUY_PORT,
    })
  );
  req.end();
});

// ------------ FOR RECEIVING ---------------------------------

const server = http.createServer();
server.listen(THIS_GUY_PORT, () => {
  console.log(`Client listening on localhost:${THIS_GUY_PORT}`);
});

server.addListener("request", (req, res) => {
  req.body = "";
  req.addListener("data", (chunk) => {
    req.body += chunk;
  });
  req.addListener("end", () => {
    req.body = JSON.parse(req.body);
    console.log(`${req.body.sender}: ${req.body.message}`);
    res.end("Message Received");
  });
});
