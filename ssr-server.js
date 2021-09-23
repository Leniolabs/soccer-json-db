require("dotenv").config();
const helmet = require("helmet");
const lowDb = require("lowdb");
const cors = require("cors");
const express = require("express");
const FileSync = require("lowdb/adapters/FileSync");
const rateLimit = require("express-rate-limit");
const jwt = require("express-jwt");
const db = lowDb(new FileSync("db/db.json"));
const app = express();
//Configs
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit each IP to 100 requests per windowMs
  message: `Too many requests, please try again later.`,
});
////

//ENV variables
const {
  env: { PORT, SECRET_KEY },
} = process;
////
// const token = jwt2.sign({ payload: "test" }, SECRET_KEY); // this is how generate token with jsonwebtoken to consume API
// console.log(token);

//Modules
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(jwt({ secret: SECRET_KEY, algorithms: ["HS256"] }));
////

//**** Http Requests *****//

//Get all
app.get("/messi/all", (request, response) => {
  const data = db.get("messi");
  response.send(data);
});

//Get goal by id
app.get("/messi/getId/:id", (request, response) => {
  const data = db.get("messi").find({ id: request.params.id });
  response.send(data);
});

//Get lastest without recieved/shot position
app.get("/messi/latest-to-fill", (request, response) => {
  const data = db
    .get("messi")
    .filter((item) => {
      return !item.shot && !item.received;
    })
    .take();
  response.send(data);
});

//update or create shot and received
app.post("/messi/update/:id", (request, response) => {
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

//Listener
app.listen(PORT, () => {
  console.log(`Your port is ${PORT}`);
});
