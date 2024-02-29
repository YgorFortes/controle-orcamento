import jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction  } from 'express';
import { CustomHttpError } from '../erros/custom.http.error';
import nodeCrom from  'node-cron';
export class VericationTokenMiddleware {
  static tokenInvalids: Array<string> = [];

  constructor() {
    nodeCrom.schedule('0 9 * * 1', ()=>{
      this.deleteTokenInOneWeek();
    });
  }
 
  public checkAuth() {
    return (req: Request, res: Response, next: NextFunction)=>{
      const tokenHeaders = req.headers.authorization;
     
      if (!tokenHeaders) {
        throw new CustomHttpError('Token não existe. Certifique-se de incluir o token no cabeçalho Authorization.', 401);
      }

      const token = tokenHeaders && tokenHeaders.split(' ')[1];

      if (!token) {
        throw new  CustomHttpError('Token não existe.', 401);
      }

      try {
        this.checkToken(token);
       
        const secret = process.env.SECRET;

        if (!secret) {
          throw new Error('A secret deve ser fornecida para gerar o token token.');
        }
        jsonwebtoken.verify(token, secret);

        next();
      } catch (error) {
        throw new CustomHttpError('Token inválido', 401);
      }
    };
  }

  static  removeToken() {
    return (req: Request, res: Response, next: NextFunction)=>{
      const tokenHeaders = req.headers.authorization;

      if (!tokenHeaders) {
        throw new CustomHttpError('Token não existe. Certifique-se de incluir o token no cabeçalho Authorization.', 401);
      }
  
      const token: string = tokenHeaders && tokenHeaders.split(' ')[1];
      VericationTokenMiddleware.tokenInvalids.push(token);
      next();
    };
    
  }

  private checkToken(token: string) {
    if (VericationTokenMiddleware.tokenInvalids.includes(token)) {
      throw new Error('Token inválido');
    }

  }

  private deleteTokenInOneWeek() {
    VericationTokenMiddleware.tokenInvalids.splice(0, VericationTokenMiddleware.tokenInvalids.length);
  }
}

