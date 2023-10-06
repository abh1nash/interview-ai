export enum RouteMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export type Route = {
  path: string;
  method: RouteMethod;
  controller: any;
  action: string;
};

import { ReportsController } from "./handlers/reports/reports.controller"; // Ensure this import path is correct.

export const routes: Route[] = [
  {
    path: "/reports/job/:jobId",
    method: RouteMethod.GET,
    controller: ReportsController,
    action: "listByJob",
  },
  {
    path: "/reports/:id",
    method: RouteMethod.GET,
    controller: ReportsController,
    action: "getReport",
  },
];
