const http = require("http");
const PORT = 5005;

const server = http.createServer();

server.addListener("request", async (clientReq, clientRes) => {
  console.log(`${clientReq.method} : ${clientReq.url}`);

  clientReq.body = "";

  clientReq.addListener("data", (chunk) => {
    clientReq.body += chunk;
  });

  clientReq.addListener("end", () => {
    const options = {
      host: "localhost",
      port: 5000,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      proxyRes.data = "";
      proxyRes.addListener("data", (chunk) => {
        proxyRes.data += chunk;
      });
      proxyRes.addListener("end", () => {
        console.log(proxyRes.data);
      });
    });

    proxyReq.addListener("error", (err) => {
      console.log(`An error occurred: `);
      console.log({ err });
    });

    proxyReq.write(clientReq.body);
    proxyReq.end();

    clientRes.end("OK");
  });
});

server.listen(PORT, () => {
  console.log("listening on localhost:" + PORT);
});
