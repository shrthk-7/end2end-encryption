const http = require("http");

const get = ({ port, path, headers }) => {
  const host = "localhost";

  return new Promise((resolve, reject) => {
    const request = http.request(
      { host, port, path, method: "GET", headers },
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

const post = ({ port, path, headers, message }) => {
  const host = "localhost";

  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        host,
        port,
        path,
        method: "POST",
        headers,
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
