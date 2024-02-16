import { NextFunction, Request, Response } from 'express';
import { AbstractRouterController } from '../../utils/abstract-class/controller/abstract.router.controller';
import { UserValidateSchema } from './validatorSchema/userSchema.validator';
import { UserService } from './services/user.services';
import { InterfaceUserLogin } from '../../utils/interfaces/validators/userSchema.interface';


export class UserController extends AbstractRouterController {
  private userSchemaValidator : UserValidateSchema;

  private userService : UserService;

  constructor() {
    super();
    this.userSchemaValidator = new UserValidateSchema();
    this.userService = new UserService();
  }

  setupRouter(): void {
    this.login();
  }

  public login(): void {
    this.router.post('/login', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const loginBValidated = await this.userSchemaValidator.login(req.body) as InterfaceUserLogin ; 

        const login = await this.userService.login(loginBValidated);
        return res.status(200).send(login);
      } catch (error) {
        next(error);
      }
    });
  }
  
}