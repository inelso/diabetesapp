const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

app.listen((process.env.PORT || 8080), () => {
  console.log("Application started and Listening on port 80");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });