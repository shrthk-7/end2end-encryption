const http = require("http");
const PROXY_PORT = 5000;

process.stdin.addListener("data", (chunk) => {
  const request = http.request(
    {
      host: "localhost",
      port: PROXY_PORT,
      path: "/",
      method: "POST",
    },
    (response) => {
      response.addListener("data", (chunk) => {
        console.log(`Server: ${chunk.toString()}`);
      });
    }
  );

  const message = chunk.toString().replace(/[\r\n]/gm, "");
  request.write(JSON.stringify({ message }));
  request.end(() => {
    console.log(`You: Message (${message}) Sent to Server`);
  });
});
