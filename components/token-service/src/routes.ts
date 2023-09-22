import { TokenController } from "./handlers/token/token.controller";

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

export const routes: Route[] = [
  {
    path: "/token/generate",
    method: RouteMethod.POST,
    controller: TokenController,
    action: "generate",
  },
  {
    path: "/token/decode",
    method: RouteMethod.GET,
    controller: TokenController,
    action: "decode",
  },
];
