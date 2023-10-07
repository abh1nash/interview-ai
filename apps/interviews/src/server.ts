import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { RabbitMQ } from "./services/rabbitmq.service";
import client from "prom-client";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (ex) {
    res.sendStatus(500);
  }
});

routes.forEach((route) => {
  app[route.method](route.path, (request, response, next) => {
    const controller = new route.controller();
    controller[route.action](request, response, next);
  });
});

RabbitMQ.initialize();

app.listen(3000, () => {
  console.log("Interviews server running on 3000");
});
