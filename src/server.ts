import express, { Application }  from 'express';
import { DynamicRoutes } from './dynamic.Routes';
class ServerApi  {
  protected expressInstance : Application;

  private dynamicRoutes : DynamicRoutes;

  server: Application;

  constructor() {
    this.expressInstance = express();
    this.dynamicRoutes = new DynamicRoutes();
    this.server = this.expressInstance;
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

    return this.server;
  }

}

const server = new ServerApi();
if (process.env.TESTE_ROUTE === 'false') {
  server.createServe();
  
}

export default server;







