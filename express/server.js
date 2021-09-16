const lowDb = require("lowdb");
const cors = require("cors");
const serverless = require("serverless-http");
const express = require("express");
const FileSync = require("lowdb/adapters/FileSync");
const db = lowDb(new FileSync("db.json"));
const app = express();

const router = express.Router();
app.use(cors());
app.use(express.json());
app.use("/.netlify/functions/server", router);

router.get("/messi", (request, response) => {
  const data = db.get("messi");
  response.send(data);
});

//Get goal by id
router.get("/messi/getId/:id", (request, response) => {
  const data = db.get("messi").find({ id: request.params.id });
  response.send(data);
});

//Get lastest 10 without recieved/shot position
router.get("/messi/latest-ten-to-fill", (request, response) => {
  const data = db.get("messi").filter((item) => {
    return !item.shot && !item.received;
  });
  response.send(data);
});

//update or create shot and received
router.post("/messi/update/:id", (request, response) => {
  const {
    body: { shot, received },
    params: { id },
  } = request;
  db.get("messi")
    .find({ id })
    .update("shot", () => shot)
    .update("received", () => received)
    .write();
  return response.send({ success: true });
});

// app.listen(PORT, () => {
//   console.log(`Backend is running on http://localhost:${PORT}`);
// });

module.exports = app;
module.exports.handler = serverless(app);
