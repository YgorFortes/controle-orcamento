import { Request, NextFunction, Response } from 'express';
import { AbstractRouterController } from '../../utils/abstract-class/controller/abstract.router.controller';
import { InterfaceCrudController } from '../../utils/interfaces/controller/interface.crud.controller';
import { ExpenseValidatorSchema } from './validatorSchema/expense.validator.schema';
import { ExpenseService } from './services/expenses.services';
import { Despesas } from '@prisma/client';


export class ExpenseController extends AbstractRouterController implements InterfaceCrudController {
  private expensesValidatorSchema: ExpenseValidatorSchema;

  private expenseService: ExpenseService;

  constructor() {
    super();
    this.expensesValidatorSchema = new ExpenseValidatorSchema();
    this.expenseService = new ExpenseService();
  }

  setupRouter(): void {
    this.findAll();
    this.findOne();
    this.create();
  }

  findAll(): void {
    this.router.get('/', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const expensesQueryValidated = await this.expensesValidatorSchema.findAll(req.query);

        const expenses = await this.expenseService.findAll(expensesQueryValidated);

        return res.status(200).send(expenses);
      } catch (error) {
        next(error);
      }
    });
  }

  findOne(): void {
    this.router.get('/:id', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const expensesIdParamsValidated = await this.expensesValidatorSchema.findOne(req.params);

        const expenseDetails = await this.expenseService.findOne(expensesIdParamsValidated);

        return res.status(200).send(expenseDetails);
      } catch (error) {
        next(error);
      }
    });
  }

  create(): void {
    this.router.post('/', async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const expensesBodyValidated =  await this.expensesValidatorSchema.create(req.body) as Despesas;

        const newExpense = await this.expenseService.create({ ...expensesBodyValidated });

        return res.status(201).send(newExpense);
      } catch (error) {
        next(error);
      }
    });

   
  }

  update(): void {
    throw new Error('Method not implemented.');
  }

  delete(): void {
    throw new Error('Method not implemented.');
  }
  
}