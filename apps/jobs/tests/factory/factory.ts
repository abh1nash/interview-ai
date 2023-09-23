import express, { Request, Response, NextFunction } from "express";
import supertest from "supertest";
import { Server, createServer } from "http";
import { routes } from "src/routes";

export class TestFactory {
  private _app: express.Application;
  private _server: Server;

  public get app(): supertest.SuperTest<supertest.Test> {
    return supertest(this._app);
  }

  public async init() {
    this._app = express();
    this._app.use(express.json());
    routes.forEach((route) => {
      this._app[route.method](
        route.path,
        (request: Request, response: Response, next: NextFunction) => {
          new (route.controller as any)()[route.action](
            request,
            response,
            next
          );
        }
      );
    });
    this._server = createServer(this._app);
  }

  public async close() {
    this._server.close();
  }
}
