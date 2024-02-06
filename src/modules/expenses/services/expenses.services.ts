/* eslint-disable @typescript-eslint/no-unused-vars */
import { InterfaceCrudService } from '../../../utils/interfaces/services/interface.service.crud';
import { Despesas } from '@prisma/client';
import { ExpenseValidatorSchema } from '../validatorSchema/expenseSchema.validator';
import { CustomHttpError } from '../../../erros/custom.http.error';
import { ExpenseRepository } from '../repository/expense.repository';
import { Moth } from '../../../utils/enuns/moth';
import { Category } from '../../../utils/enuns/category';


export class ExpenseService implements InterfaceCrudService<Despesas> {
  private expensesValidatorSchema: ExpenseValidatorSchema;

  private expenseRepository: ExpenseRepository;
 
  constructor() {
    this.expensesValidatorSchema = new ExpenseValidatorSchema();
    this.expenseRepository = new ExpenseRepository();
  }

  public  async findAll(filter? :  object): Promise<Array<Despesas> | undefined> {
    try {
      await this.expensesValidatorSchema.findAll({ filter });

      const listRevenue = await this.expenseRepository.findAll(filter);

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


  public async findRevenueByMonth(filterDate:  { ano: number, mes: number, page?: number, limit?: number }):  Promise<Array<Despesas> | undefined> {
    try {
      await this.expensesValidatorSchema.validateAndMergeExpenseFilters({ ...filterDate }, { ...filterDate });

      return await this.expenseRepository.findExpanseByMonth({ ...filterDate });
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }
  

  public async create(dataExpense: Despesas): Promise<Despesas | undefined> {
    try {

      await this.expensesValidatorSchema.create(dataExpense);

      const expenseData = Object.assign({}, dataExpense, { categoria: dataExpense.categoria || Category.OUTRAS } );


      await this.verifyUniqueMonthlyDescription(dataExpense.descricao, dataExpense.data);

      const newExpense = await this.expenseRepository.create(expenseData);

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

  public async delete(elementId: number): Promise<object | undefined> {
    try {
      await this.expensesValidatorSchema.delete({ id: elementId });

      await this.findOne(elementId);

      const resultDelete = await this.expenseRepository.delete(elementId);

      if (!resultDelete) {
        throw new CustomHttpError('Erro ao tentar deletar despesa.');
      }

      return { mensagem: 'Despesa excluida com sucesso.' };
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
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
