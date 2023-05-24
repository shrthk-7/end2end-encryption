const http = require("http");

const SERVER_PORT = 5000;

http
  .createServer((req, res) => {
    req.on("data", (chunk) => {
      console.log(chunk.toString());
    });
    req.on("end", () => {
      res.end("Message Received");
    });
  })
  .listen(SERVER_PORT, () => {
    console.log(`actual server listening on: localhost:${SERVER_PORT}`);
  });
