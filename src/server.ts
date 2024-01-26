import express, { Server } from 'express';
import { DynamicRoutes } from './dynamic.Routes';
class ServerApi  {
  protected expressIntence : Server;

  private dynamicRoutes : DynamicRoutes;

  constructor() {
    this.expressIntence = express();
    this.dynamicRoutes = new DynamicRoutes();
    this.setRoutes();
  }
  
  private setRoutes(): void {
    this.dynamicRoutes.attachToApp(this.expressIntence);
  }


  public createServe() {
    const serverPort = process.env.PORT || 3000;
    this.expressIntence.listen(serverPort, ()=>{
      console.log(`Server is running on port http://localhost:${serverPort}/api/v1`);
    });
  }

}

const server = new ServerApi();
server.createServe();







