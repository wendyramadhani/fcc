require("dotenv").config();
const { nanoid, customAlphabet } = require("nanoid");
const dns = require("dns");
const url = require("url");
const alp = "0123456789";
const randid = customAlphabet(alp, 5);
const express = require("express");
const cors = require("cors");
const { error } = require("console");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

var db = { original_url: "", short_url: "" };

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
app.post("/api/shorturl", (req, res) => {
  const req_url = req.body.url;
  var host;
  try {
    host = new URL(req_url).hostname;
  } catch {
    res.json({ error: "Invalid URL" });
  }
  dns.lookup(host, (err, address) => {
    if (err) {
      res.json({ error: "Invalid URL" });
    } else {
      const code = randid(5);
      db.original_url = req_url;
      db.short_url = code;
      res.json(db);
    }
  });
});

// Your first API endpoint
app.get("/api/shorturl/:url", function (req, res) {
  req_url = req.params.url;
  // console.log(db.original_url)
  res.redirect(db.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
