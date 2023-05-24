const http = require("http");
const PORT = 5000;

http
  .createServer((req, res) => {
    req.on("data", (chunk) => {
      console.log(chunk.toString());
    });
    req.on("end", () => {
      res.end("Message Received");
    });
  })
  .listen(PORT, () => {
    console.log(`actual server listening on: localhost:${PORT}`);
  });
