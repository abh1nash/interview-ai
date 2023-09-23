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

export const routes: Route[] = [];
