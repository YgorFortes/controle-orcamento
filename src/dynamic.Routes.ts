import { Router, Application } from 'express';
import bodyParser from 'body-parser';
import { AppController } from './modules/app/app.controller';

export class DynamicRoutes {
  protected router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  public setupRoutes(): void {
    this.router.use(bodyParser.json());

    // Instanciar controladores e definir rotas
    const appController = new AppController();

    this.router.use('/', appController.routes());
  
  }

  public attachToApp(app: Application): void {
    app.use('/api/v1', this.router);
  }
}
