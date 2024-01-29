import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import { CustomHttpError } from '../erros/custom.http.error';
export class ErrorMiddleware {
  

  handleRequestErros() {
    return (error: ValidationError | CustomHttpError | Error, req: Request, res: Response, next: NextFunction)=>{
      if (error instanceof ValidationError) {
        return res.status(400).send({ mensagem: error.message });
      }

      if (error instanceof CustomHttpError) { 
        return res.status(error.statusCode).send({ mensagem: error.message });
      }

      if (error instanceof Error) {
        return res.status(500).send({ mensagem: 'Servidor com problemas! Volte mais tarde.'  });
      }

      next();
    };
  }


}