import { Receitas } from '@prisma/client';
import { AbstractRouterController } from '../../utils/abstract-class/controller/abstract.router.controller';
import { InterfaceCrudController } from '../../utils/interfaces/controller/interface.crud.controller';
import { RevenueService } from './services/revenue.services';
import { RevenueValidatorSchema } from './validatorSchema/revenueSchema.validator';
import  {  NextFunction, Request, Response } from 'express';
import { RevenueUpdateValidation, RevenuefindRevenueForMonth } from '../../utils/interfaces/validators/interface.revenue.schema';

export class RevenueController extends AbstractRouterController implements InterfaceCrudController  {
  private validatorSchemaRevenue: RevenueValidatorSchema;

  private revenueService: RevenueService;

  constructor() {
    super();
    this.validatorSchemaRevenue = new RevenueValidatorSchema();
    this.revenueService = new  RevenueService();
  }

  setupRouter(): void {
    this.findAll();
    this.findOne();
    this.findRevenueForMonth();
    this.create();
    this.update();
    this.delete();
  }

  public findAll(): void {
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

  
  public findOne(): void {
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

  public findRevenueForMonth() {
    this.router.get('/:ano/:mes', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const monthValidated = await this.validatorSchemaRevenue.validateAndMergeRevenueFilters(req.params, req.query) as RevenuefindRevenueForMonth;
        const revenueForMonth = await this.revenueService.findRevenueByMonth({ ...monthValidated }) ;
        return res.status(200).send(revenueForMonth);
      } catch (error) {
        next(error);
      }
    });
  }

  public create(): void {
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


  public update(): void {
    this.router.put('/:id', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const revenuePutValidated = await this.validatorSchemaRevenue.update(req.params, req.body) as RevenueUpdateValidation ;
        
        const newInfoRevenue = await this.revenueService.update(revenuePutValidated.params, revenuePutValidated.body);
        
        return res.status(200).send(newInfoRevenue);
      } catch (error) {
        next(error);
      }
    });
  }

  public delete(): void {
    this.router.delete('/:id', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const idParamsRevenueValidated = await this.validatorSchemaRevenue.delete(req.params);

        const result = await this.revenueService.delete(idParamsRevenueValidated);

        return res.status(200).send(result);
      } catch (error) {
        next(error);
      }
    });
  }


}