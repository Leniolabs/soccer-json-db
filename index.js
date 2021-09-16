const lowDb = require("lowdb");
const cors = require("cors");
const express = require("express");
const FileSync = require("lowdb/adapters/FileSync");
const db = lowDb(new FileSync("db.json"));
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 4000;

app.get("/messi", (request, response) => {
  const data = db.get("messi");
  response.send(data);
});

//Get goal by id
app.get("/messi/getId/:id", (request, response) => {
  const data = db.get("messi").find({ id: request.params.id });
  response.send(data);
});

//Get lastest 10 without recieved/shot position
app.get("/messi/latest-ten-to-fill", (request, response) => {
  const data = db.get("messi").filter((item) => {
    return !item.shot && !item.received;
  });
  response.send(data);
});

//update or create shot and received
app.post("/messi/update/:id", (request, response) => {
  const {
    body: { shot, received },
  } = request;
  const data = db
    .get("messi")
    .find({ id: request.params.id })
    .update("shot", () => shot)
    .update("received", () => received)
    .write();
  return response.send({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
