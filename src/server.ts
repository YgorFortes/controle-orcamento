import express, { Application }  from 'express';
import { DynamicRoutes } from './dynamic.Routes';
class ServerApi  {
  protected expressInstance : Application;

  private dynamicRoutes : DynamicRoutes;

  constructor() {
    this.expressInstance = express();
    this.dynamicRoutes = new DynamicRoutes();
    this.setRoutes();
  }
  
  private setRoutes(): void {
    this.dynamicRoutes.attachToApp(this.expressInstance);
  }


  public createServe() {
    const serverPort = process.env.PORT || 3000;
    this.expressInstance.listen(serverPort, ()=>{
      console.log(`Server is running on port http://localhost:${serverPort}/api/v1`);
    });
  }

}

const server = new ServerApi();
server.createServe();







