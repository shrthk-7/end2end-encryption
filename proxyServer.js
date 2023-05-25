const http = require("http");
const fetchData = require("./fetchData");

const PROXY_PORT = 5005;

const server = http.createServer();

server.addListener("request", (clientReq, clientRes) => {
  clientReq.body = "";
  clientReq.addListener("data", (chunk) => {
    clientReq.body += chunk;
  });

  clientReq.addListener("end", async () => {
    clientReq.body = JSON.parse(clientReq.body);

    const options = {
      port: clientReq.body.recipient,
      path: clientReq.url,
      headers: clientReq.headers,
    };

    if (clientReq.url === "/public-key") {
      const serverRes = await fetchData.get(options);
      return clientRes.end(serverRes);
    }

    if (clientReq.url === "/") {
      options.message = JSON.stringify(clientReq.body);
      console.log({ message: clientReq.body.message });
      const serverRes = await fetchData.post(options);
      clientRes.end(serverRes);
    }
  });
});

server.listen(PROXY_PORT, () => {
  console.log(`proxy server listening on localhost:${PROXY_PORT}`);
});
