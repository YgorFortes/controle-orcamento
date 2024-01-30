import { Receitas } from '@prisma/client';
import { AbstractRouterController } from '../../utils/abstract-class/controller/abstract.router.controller';
import { InterfaceCrudController } from '../../utils/interfaces/controller/interface.crud.controller';
import { RevenueService } from './services/revenue.services';
import { ValidatorSchemaRevenue } from './validatorSchema/ValidatorSchemaReceita';
import  {  NextFunction, Request, Response } from 'express';
import { RevenueUpdateValidation } from '../../utils/interfaces/validators/interface.revenue.schema';

export class RevenueController extends AbstractRouterController implements InterfaceCrudController  {
  private validatorSchemaRevenue: ValidatorSchemaRevenue;

  private revenueService: RevenueService;

  constructor() {
    super();
    this.validatorSchemaRevenue = new ValidatorSchemaRevenue();
    this.revenueService = new  RevenueService();
  }

  setupRouter(): void {
    this.findAll();
    this.findOne();
    this.create();
    this.update();
  }

  findAll(): void {
    this.router.get('/', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const revenueQueryValidated = await this.validatorSchemaRevenue.findAll(req.query);

        const listRevenue = await this.revenueService.findAll({ ...revenueQueryValidated });
        return res.status(200).send(listRevenue);
      } catch (error) {
        next(error);
      }
    });
  }

  
  findOne(): void {
    this.router.get('/:id', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const idParamsRevenueValidated = await this.validatorSchemaRevenue.findOne(req.params);

        const revenueDetails = await this.revenueService.findOne(idParamsRevenueValidated);

        return res.status(200).send(revenueDetails);
      } catch (error) {
        next(error);
      }
    });
  }

  create(): void {
    this.router.post('/', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const revenueBodyValidated = await this.validatorSchemaRevenue.create(req.body);

        const newRevenue = await this.revenueService.create({ ...revenueBodyValidated } as Receitas);
        
        return res.status(201).send(newRevenue);
      } catch (error) {
        next(error);
      }
    });
  }


  update(): void {
    this.router.put('/:id', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const revenuePutValidated = await this.validatorSchemaRevenue.update(req.params, req.body) as RevenueUpdateValidation ;
        
        const newInfoRevenue = await this.revenueService.update(revenuePutValidated.params, revenuePutValidated.body);
        
        return res.status(201).send(newInfoRevenue);
      } catch (error) {
        next(error);
      }
    });
  }


  
  delete(): void {
    
  }


}