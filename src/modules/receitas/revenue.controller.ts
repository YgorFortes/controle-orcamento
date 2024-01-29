import { Receitas } from '@prisma/client';
import { AbstractRouterController } from '../../utils/abstract-class/controller/abstract.router.controller';
import { InterfaceCrudController } from '../../utils/interfaces/controller/interface.crud.controller';
import { RevenueService } from './services/revenue.services';
import { ValidatorSchemaRevenue } from './validatorSchema/ValidatorSchemaReceita';
import  {  NextFunction, Request, Response } from 'express';

export class RevenueController extends AbstractRouterController implements InterfaceCrudController  {
  private validatorSchemaRevenue: ValidatorSchemaRevenue;

  private revenueService: RevenueService;

  constructor() {
    super();
    this.validatorSchemaRevenue = new ValidatorSchemaRevenue();
    this.revenueService = new  RevenueService();
  }

  setupRouter(): void {
    this.create();
  }

  create(): void {
    this.router.post('/', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const revenueBodyValidated = await this.validatorSchemaRevenue.create(req.body);

        const newRevenue = await this.revenueService.create({ ...revenueBodyValidated } as Receitas);
        
        return res.status(200).send(newRevenue);
      } catch (error) {
        next(error);
      }
    });
  }

  findAll(): void {
    
  }

  findOne(): void {
    
  }

  

  update(): void {
    
  }


  
  delete(): void {
    
  }


}