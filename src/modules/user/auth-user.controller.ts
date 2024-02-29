import { UserValidateSchema } from './validatorSchema/userSchema.validator';
import { UserUtils } from '../../utils/user.utils';
import { AbstractRouterController } from '../../utils/abstract-class/controller/abstract.router.controller';
import { Request, Response, NextFunction } from 'express';
import { InterfaceUserUpdate, InserfaceUserDelete } from '../../utils/interfaces/validators/userSchema.interface';
import { VericationTokenMiddleware } from '../../middlewares/verify-token.middleware';
import { AuthUserService } from './services/auth-user.services';

export class AuthUserController extends AbstractRouterController {
  
  private userSchemaValidator : UserValidateSchema;

  private authUserService : AuthUserService;

  private userUtils : UserUtils;

  
  constructor() {
    super();
    this.userSchemaValidator = new UserValidateSchema();
    this.authUserService = new AuthUserService();
    this.userUtils = new UserUtils();
  }

  setupRouter(): void {
    this.update();
    this.delete();
    this.logout();
  }

  private update(): void {
    this.router.patch('/atualizar',  async (req: Request, res: Response, next: NextFunction)=>{
      try {
  
        const userBodyValidated  = await this.userSchemaValidator.update(req.body) as InterfaceUserUpdate;

        const idUser = this.userUtils.getIdUserFromToken(req);
        
        const result = await this.authUserService.update(userBodyValidated, idUser);
        return res.status(200).send({ ...result });
      } catch (error) {
        next(error);
      }
    });
  }

  
  private delete(): void {
    this.router.delete('/excluir',  async (req: Request, res: Response, next: NextFunction)=>{
      try {

        const userBodyValidated = await this.userSchemaValidator.delete(req.body) as InserfaceUserDelete;

        const idUser = this.userUtils.getIdUserFromToken(req);

        const result = await  this.authUserService.delete(userBodyValidated, idUser) ;
        return res.status(200).send({ ...result });
      } catch (error) {
        next(error);
      }
    } );
  }

  private logout(): void {
    this.router.get('/logout', VericationTokenMiddleware.removeToken(), async (req: Request, res: Response, next: NextFunction)=>{
      try {
  
        return res.status(200).send({ mensagem:'Usuário deslogado com sucesso' });
      } catch (error) {
        next(error);
      }
    });
  }
}