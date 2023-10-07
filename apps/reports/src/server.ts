import express from "express";
import cors from "cors";
import { routes } from "./routes";
import client from "prom-client";

import { listenForReports } from "./services/rabbitmq.service";

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

// Start listening for reports
listenForReports();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Reports server running on port ${PORT}`);
});
