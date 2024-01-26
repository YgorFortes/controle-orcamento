import { Router } from 'express';

export abstract class AbstractRouterController {
  protected router : Router;

  constructor() {
    this.router = Router();
    this.setupRouter();
  }

  abstract setupRouter() : void; 

  routes() : Router {
    return this.router;
  }
}