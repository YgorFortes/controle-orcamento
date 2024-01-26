import { Request, Response } from 'express';
import { AppService } from './services/app.service';
import { AbstractRouterController } from '../../utils/abstract-class/controller/abstract-router-controller.ts';
export class AppController extends AbstractRouterController {

  private appService : AppService;

  constructor() {
    super();
    this.appService = new AppService();
    this.setupRouter();
  }
 

  responseMainRouter() : object {
    return { message: 'Application are online' };
  }

  setupRouter(): void {
    this.appInformation();
  }

  appInformation() {
    this.router.get('/', (req: Request, res: Response)=>{
      res.send(this.appService.responseMainRouter());
    });
  }
}