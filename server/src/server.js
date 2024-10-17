const express = require("express");

const app = express();

const host = "localhost";
const port = "8080";

app.get("/", (req, res) => {
  res.send("<h1>Welcome to my API Server</h1>");
});

app.listen(port, host, () => {
  console.log(`This server is running in http://${host}:${port}`);
});
