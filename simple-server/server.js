const express = require("express");
const app = express();
const port = 3000;

const SECOND = 1000;
const MINUTE = 60 * SECOND;

// const QUICK_REQUEST_TIMEOUT = 30 * SECOND;
// const INTENSIVE_REQUEST_TIMEOUT = 1 * MINUTE;
const QUICK_REQUEST_TIMEOUT = 1 * SECOND;
const INTENSIVE_REQUEST_TIMEOUT = 5 * SECOND;

const profile = {
  id: 1000,
  userName: "Steven",
};

const getFollowers = () => {
  const followers = [];
  for (let i = 1; i <= 10; i++) {
    followers.push({ id: 1000 + i, userName: `Follower ${i}` });
  }
  return followers;
};

app.get("/api/profile", (req, res) => {
  console.log("/api/profile");
  setTimeout(() => {
    res.json(profile);
  }, QUICK_REQUEST_TIMEOUT);
});

app.get("/api/followers", (req, res) => {
  console.log("/api/followers");
  setTimeout(() => {
    res.json(getFollowers());
  }, INTENSIVE_REQUEST_TIMEOUT);
});

app.listen(port, () => {
  console.log(`server is listening at http://localhost:${port}`);
});
