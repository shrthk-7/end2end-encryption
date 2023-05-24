const http = require("http");
const PORT = 5005;

const server = http.createServer();

server.addListener("request", (req, res) => {
  console.log(`${req.method} : ${req.url}`);

  if (req.method === "POST") {
    let reqBody = "";
    req.addListener("data", (chunk) => {
      reqBody += chunk;
    });
    req.addListener("end", () => {
      const message = JSON.parse(reqBody.toString());
      console.log(message);
      res.end("OK");
    });
  }
});

server.listen(PORT, () => {
  console.log("listening on localhost:" + PORT);
});
