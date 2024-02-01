/* eslint-disable @typescript-eslint/no-unused-vars */
import { InterfaceCrudService } from '../../../utils/interfaces/services/interface.service.crud';
import { Despesas } from '@prisma/client';
import { ExpenseValidatorSchema } from '../validatorSchema/expense.validator.schema';
import { CustomHttpError } from '../../../erros/custom.http.error';
import { ExpenseRepository } from '../repository/expense.repository';
import { Moth } from '../../../utils/enuns/moth';


export class ExpenseService implements InterfaceCrudService<Despesas> {
  private expensesValidatorSchema: ExpenseValidatorSchema;

  private expenseRepository: ExpenseRepository;
 
  constructor() {
    this.expensesValidatorSchema = new ExpenseValidatorSchema();
    this.expenseRepository = new ExpenseRepository();
  }

  public  async findAll(filter? : { page?: number, limit?: number }): Promise<Array<Despesas> | undefined> {
    try {
      
      const { page, limit } = filter ?? {};

      if (page || limit) {
        return await this.pagination(page, limit);
      }

      const listRevenue = await this.expenseRepository.findAll();

      return listRevenue;
      
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  public async findOne(elementId: number): Promise<Despesas | undefined> {
    try {
      await this.expensesValidatorSchema.findOne({ id: elementId });

      const expenseDetails = await this.expenseRepository.findOne(elementId);

      if (!expenseDetails) {
        throw new CustomHttpError('Despesa não encontrada.', 200);
      }

      return expenseDetails;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  public async create(dataExpense: Despesas): Promise<Despesas | undefined> {
    try {
      await this.expensesValidatorSchema.create(dataExpense);

      await this.verifyUniqueMonthlyDescription(dataExpense.descricao, dataExpense.data);

      const newExpense = await this.expenseRepository.create(dataExpense);

      return newExpense;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
 
  }

  public async update(elementId: number, dataExpense: Despesas): Promise<Despesas | undefined> {
    try {
      await this.expensesValidatorSchema.update({ id: elementId }, { ... dataExpense });

      await this.verifyUniqueMonthlyDescription(dataExpense.descricao, dataExpense.data);

      await this.findOne(elementId);

      const newInforExpese = await this.expenseRepository.update(elementId, dataExpense);

      return newInforExpese;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  delete(elementId: number): Promise<object | undefined> {
    throw new Error('Method not implemented.');
  }

  private getMonthName(date: Date): string {
    return Moth[date.getMonth() + 1];
  }

  private async verifyUniqueMonthlyDescription(descrition: string, date: Date): Promise<void> {
    try {
      const duplicateExpense = await this.expenseRepository.checkDuplicateDescriptionInSameMonth(descrition, date);
      if (duplicateExpense > 0 ) {
        const mothName = this.getMonthName(date);
        throw new CustomHttpError(`Despesa ${descrition} do mês ${mothName} já cadastrada.`, 400);
      }
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  private async pagination(page: number | undefined, limit: number | undefined) : Promise<Array<Despesas> | undefined> {
    try {
      const expensePaginated =  await this.expenseRepository.pagination(page, limit);

      return expensePaginated;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

}
