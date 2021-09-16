const lowDb = require("lowdb");
const cors = require("cors");
const express = require("express");
const FileSync = require("lowdb/adapters/FileSync");
const db = lowDb(new FileSync("db.json"));
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(express.json());

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.get("/messi", (request, response) => {
      const data = db.get("messi");
      response.send(data);
    });
    //Get goal by id
    server.get("/messi/getId/:id", (request, response) => {
      const data = db.get("messi").find({ id: request.params.id });
      response.send(data);
    });

    //Get lastest 10 without recieved/shot position
    server.get("/messi/latest-to-fill", (request, response) => {
      const data = db
        .get("messi")
        .filter((item) => {
          return !item.shot && !item.received;
        })
        .take();
      response.send(data);
    });

    //update or create shot and received
    server.post("/messi/update/:id", (request, response) => {
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

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
