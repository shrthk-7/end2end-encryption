const http = require("http");

const get = ({ host, port, path }) => {
  host |= "localhost";
  path |= "/";
  port |= 5000;

  return new Promise((resolve, reject) => {
    const request = http.request(
      { host, port, path, method: "GET" },
      (response) => {
        response.body = "";
        console.log(response.headers);
        response.addListener("data", (chunk) => {
          response.body += chunk;
        });
        response.addListener("end", () => {
          resolve(response.body);
        });
      }
    );

    request.addListener("error", (err) => {
      reject(err);
    });

    request.end();
  });
};

const post = ({ host, port, path, message }) => {
  host |= "localhost";
  path |= "/";
  port |= 5000;
  message |= "hello world";

  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        host,
        port,
        path,
        method: "POST",
      },
      (response) => {
        response.body = "";
        response.addListener("data", (chunk) => {
          response.body += chunk;
        });
        response.addListener("end", () => {
          resolve(response.body);
        });
      }
    );

    request.addListener("error", (error) => {
      reject(error);
    });

    request.write(message);
    request.end();
  });
};

module.exports = { get, post };
