const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const Router = require('express').Router;
module.exports = (dbFile, dbName) => {
    const db = lowDb(new FileSync(`${__dirname}/db/${dbFile}`));
    const router = Router();

    //Get all
    router.get("/all", (request, response) => {
        const data = db.get(dbName);

        response.send(data ?? []);
    });

    //Get goal by id
    router.get("/getId/:id", (request, response) => {
        const data = db
            .get(dbName)
            .find({ id: parseInt(request.params.id) })
            .value();
        if(data) {
            response.send(data);
        } else {
            response.status(404).send("Not found");
        }
    });

    //Get lastest without recieved/shot position
    router.get("/latest-to-fill", (request, response) => {
        const data = db
            .get(dbName)
            .filter((item) => {
                return !item.shot || !item.received;
            })
            .take()
            .value();
        if(data && data.length) {
            response.send(data[0]);
        } else {
            response.status(404).send("Not found");
        }

    });

    //update or create shot and received
    router.post("/update/:id", (request, response) => {
        const {
            body: { shot, received, goal },
            params: { id },
        } = request;
        db.get(dbName)
            .find({ id: parseInt(id) })
            .update("shot", () => shot)
            .update("received", () => received)
            .update("goal", () => goal)
            .write();
        return response.send({ success: true });
    });
    return router;
}