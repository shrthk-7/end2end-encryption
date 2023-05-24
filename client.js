const http = require("http");

const PROXY_PORT = 5005;

process.stdin.addListener("data", (chunk) => {
  const req = http.request(
    {
      host: "localhost",
      port: PROXY_PORT,
      path: "/",
      method: "POST",
    },
    (res) => {
      res.addListener("data", (chunk) => {
        console.log(`SERVER: ${chunk.toString()}`);
      });
    }
  );

  const message = chunk.toString().replace(/[\r\n]/gm, "");
  req.write(JSON.stringify({ message }));
  req.end(() => {
    console.log(`YOU: Message (${message}) Sent to Server`);
  });
});
