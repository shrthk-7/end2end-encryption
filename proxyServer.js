const http = require("http");

const PROXY_PORT = 5005;
const SERVER_PORT = 5000;

const server = http.createServer();

server.addListener("request", async (clientReq, clientRes) => {
  clientReq.body = "";
  clientReq.addListener("data", (chunk) => {
    clientReq.body += chunk;
  });

  clientReq.addListener("end", () => {
    // console.log(`CLIENT: ${clientReq.body}`);
    clientReq.body = JSON.parse(clientReq.body);

    const options = {
      host: "localhost",
      port: clientReq.body.recipient,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers,
    };

    const serverReq = http.request(options, (serverRes) => {
      serverRes.data = "";
      serverRes.addListener("data", (chunk) => {
        serverRes.data += chunk;
      });
      serverRes.addListener("end", () => {
        console.log(`SERVER: ${serverRes.data}`);
      });
    });

    serverReq.write(JSON.stringify(clientReq.body));
    serverReq.end(() => {
      clientRes.end("Message Sent to Server");
    });
  });
});

server.listen(PROXY_PORT, () => {
  console.log(`proxy server listening on localhost:${PROXY_PORT}`);
});
