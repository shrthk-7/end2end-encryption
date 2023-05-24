const http = require("http");
const PORT = 5005;

const server = http.createServer();

server.addListener("request", async (clientReq, clientRes) => {
  console.log(`${clientReq.method} : ${clientReq.url}`);

  const options = {
    host: "localhost",
    port: 5000,
    path: clientReq.url,
    method: clientReq.method,
    headers: clientReq.headers,
  };
  const proxyReq = http.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  clientReq.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log("listening on localhost:" + PORT);
});
