import express, { Application, Router, json } from 'express';
import { AppController } from './modules/app/app.controller';
import { RevenueController } from './modules/revenue/revenue.controller'; 
import { ErrorMiddleware } from './middlewares/error.middewares';
import { ExpenseController } from './modules/expenses/expense.controller';
import { SummaryController } from './modules/summary/summary.controller';
import { UserController } from './modules/user/user.controller';
import { VericationTokenMiddleware } from './middlewares/verify-token.middleware';
import { AuthUserController } from './modules/user/auth-user.controller';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './swagger';


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
    const vericationTokenMiddleware =  new VericationTokenMiddleware();


    const appController = new AppController();
    const revenueController = new RevenueController();
    const expensesController = new ExpenseController();
    const summaryController = new SummaryController();
    const userController = new UserController();
    const authUserController = new AuthUserController();


    this.router.use('/', appController.routes());
    this.router.use('/', userController.routes());
    this.router.use('/usuario', vericationTokenMiddleware.checkAuth(), authUserController.routes());
    this.router.use('/receitas', vericationTokenMiddleware.checkAuth(), revenueController.routes());
    this.router.use('/despesas', vericationTokenMiddleware.checkAuth(), expensesController.routes());
    this.router.use('/resumo', vericationTokenMiddleware.checkAuth(), summaryController.routes());
    

    this.router.use(errorMiddleware.handleRequestErros());
    this.router.use(errorMiddleware.handleError404());
  }

  public attachToApp(app: Application): void {
    app.use('/api/v1', this.router);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }
}
