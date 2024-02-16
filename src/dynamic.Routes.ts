import express, { Application, Router, json } from 'express';
import { AppController } from './modules/app/app.controller';
import { RevenueController } from './modules/revenue/revenue.controller'; 
import { ErrorMiddleware } from './middlewares/error.middewares';
import { ExpenseController } from './modules/expenses/expense.controller';
import { SummaryController } from './modules/summary/summary.controller';
import { UserController } from './modules/user/user.controller';

export class DynamicRoutes {
  protected router: express.Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  public setupRoutes(): void {
    this.router.use(json());

    // Instanciar controladores e definir rotas
    const errorMiddleware = new ErrorMiddleware();
    const appController = new AppController();
    const revenueController = new RevenueController();
    const expensesController = new ExpenseController();
    const summaryController = new SummaryController();
    const userController = new UserController();

    this.router.use('/', appController.routes());
    this.router.use('/', userController.routes());
    this.router.use('/receitas', revenueController.routes());
    this.router.use('/despesas', expensesController.routes());
    this.router.use('/resumo', summaryController.routes());

    this.router.use(errorMiddleware.handleRequestErros());
    this.router.use(errorMiddleware.handleError404());
  }

  public attachToApp(app: Application): void {
    app.use('/api/v1', this.router);
  }
}
