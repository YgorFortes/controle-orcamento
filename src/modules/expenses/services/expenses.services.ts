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

  findAll(filter: object): Promise<Despesas[] | undefined> {
    throw new Error('Method not implemented.');
  }

  findOne(elementId: number): Promise<Despesas | undefined> {
    throw new Error('Method not implemented.');
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

  update(elementId: number, element: Despesas): Promise<Despesas | undefined> {
    throw new Error('Method not implemented.');
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

}
