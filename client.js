const http = require("http");

http
  .createServer((req, res) => {
    req.on("data", (chunk) => {
      console.log(chunk.toString());
    });
    req.on("end", () => {
      res.end("ok");
    });
  })
  .listen(5000);
