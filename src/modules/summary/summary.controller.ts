import { NextFunction, Request, Response } from 'express';
import { AbstractRouterController } from '../../utils/abstract-class/controller/abstract.router.controller';
import { SummaryValidatorSchema } from './validatorSchema/summarySchema.validator';
import { SummaryService } from './services/summary.service';
import { InterfaceSummarySearchOptions } from '../../utils/interfaces/validators/sumarySchema.interface';

export class SummaryController extends AbstractRouterController {
  private summaryValidatorSchema: SummaryValidatorSchema;

  private summaryService: SummaryService;

  constructor() {
    super();
    this.summaryValidatorSchema = new SummaryValidatorSchema();
    this.summaryService = new SummaryService();
  }

  setupRouter(): void {
    this.summary();
  }

  summary(): void {
    this.router.get('/:ano/:mes', async (req: Request, res: Response, next: NextFunction )=>{
      try {
        const summaryValidated = await this.summaryValidatorSchema.validateSumary(req.params) as InterfaceSummarySearchOptions;

        const summary = await this.summaryService.sumary(summaryValidated);
        return res.status(200).send(summary);
      } catch (error) {
        next(error);
      } 
    });
  }
  
}