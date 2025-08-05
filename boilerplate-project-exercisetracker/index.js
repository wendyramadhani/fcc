const express = require("express");
const { nanoid } = require("nanoid");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

var users = [];
var exercises = [];
var log = [];

app.post("/api/users/", (req, res) => {
  const _id = nanoid(24);
  const user = req.body.username;
  const dummy = {
    _id: _id,
    username: user,
  };
  users.push(dummy);
  // console.log(users);
  res.json(dummy);
});
app.get("/api/users", (req, res) => {
  res.json(users);
});
app.post("/api/users/:_id/exercises", (req, res) => {
  var reqbody = req.body;
  // console.log(reqbody);
  var id = req.params._id;
  // console.log("asdasdasd" + id);
  var desc = reqbody.description;
  var duration = reqbody.duration;
  var date = new Date(reqbody.date);
  var furmated_date = date.toDateString();
  const user = users.find((u) => u._id == id);

  if (user) {
    // console.log(user.username); // Output: bob
  } else {
    // console.log("User not found");
  }

  var dummy = {
    username: user.username,
    description: desc,
    duration: parseInt(duration),
    date: furmated_date,
    _id: id,
  };
  // console.log(dummy);
  exercises.push(dummy);
  res.json(dummy);
});

app.get("/api/users/:_id/logs", (req, res) => {
  const id = req.params._id;
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;
  const limit = req.query.limit ? parseInt(req.query.limit) : null;

  const user = users.find((u) => u._id === id);
  if (!user) return res.json({ error: "User not found" });

  let logs = exercises.filter((ex) => {
    if (ex._id !== id) return false;
    var date;
    if (ex.date == "Invalid Date") {
      date = new Date().toDateString();
    } else {
      date = new Date(ex.date).toDateString();
    }
    // console.log(date);

    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  });

  if (limit) {
    logs = logs.slice(0, limit);
  }

  // Format date as required (e.g., "Mon Jan 01 1990")
  logs = logs.map((log) => ({
    description: log.description,
    duration: log.duration,
    date:
      log.date == "Invalid Date"
        ? new Date().toDateString()
        : new Date(log.date).toDateString(),
  }));
  console.log(logs);

  res.json({
    username: user.username,
    count: logs.length,
    _id: user._id,
    log: logs,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
