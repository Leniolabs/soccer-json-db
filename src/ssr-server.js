require("dotenv").config();
const express = require("express");
// const rateLimit = require("express-rate-limit");
const jwt = require("express-jwt");
const app = express();
//Configs
// const limiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: `Too many requests, please try again later.`,
// });
////

//ENV variables
const {
  env: { PORT, SECRET_KEY },
} = process;
////
// const token = jwt2.sign({ payload: "test" }, SECRET_KEY); // this is how generate token with jsonwebtoken to consume API
// console.log(token);

//Modules
// app.use(limiter);
app.use(express.json());
app.use(jwt({ secret: SECRET_KEY, algorithms: ["HS256"] }));

// CORS //
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
//**** Http Requests *****//
const useDataset = require("./dataset-route");

app.use("/messi", useDataset("db.json", "messi"));
app.use("/world", useDataset("world.json", "world"));

//Listener
app.listen(PORT, () => {
  console.log(`Your port is ${PORT}`);
});
