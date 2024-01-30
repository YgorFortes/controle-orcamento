import express, { Application, Router, json } from 'express';
import { AppController } from './modules/app/app.controller';
import { RevenueController } from './modules/receitas/revenue.controller';
import { ErrorMiddleware } from './middlewares/error.middewares';

export class DynamicRoutes {
  protected router: express.Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  public setupRoutes(): void {
    this.router.use(json());

    // Instanciar controladores e definir rotas
    const appController = new AppController();
    const revenueController = new RevenueController();
    const errorMiddleware = new ErrorMiddleware();

    this.router.use('/', appController.routes());
    this.router.use('/receitas', revenueController.routes());

    this.router.use(errorMiddleware.handleRequestErros());
    this.router.use(errorMiddleware.handleError404());
  }

  public attachToApp(app: Application): void {
    app.use('/api/v1', this.router);
  }
}
