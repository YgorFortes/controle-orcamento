/* eslint-disable @typescript-eslint/no-unused-vars */
import { CrudRepository } from '../../../utils/abstract-class/repository/abstract.crud.repository';
import { Despesas } from '@prisma/client';

export class ExpenseRepository  extends CrudRepository<Despesas> {

  public async findAll(filter?:  {  page?: number, limit?: number, descricao?: string }): Promise<Array<Despesas>> {
    const { page = 1, limit = 10, descricao } = filter ?? {};

    const listExpenses = await this.primaClient.despesas.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: descricao ? { descricao: { contains: descricao } } : undefined,
    });

    return listExpenses;
  }
 

  public async findOne(elementId: number): Promise<Despesas | null> {
    const expenseDetails = await this.primaClient.despesas.findUnique({
      where: {
        id: elementId,
      },
    });

    return expenseDetails;
  }

  

  public async create(dataExpense: Despesas): Promise<Despesas> {
    const newExpense = await this.primaClient.despesas.create({
      data: dataExpense,
    });

    return newExpense;
  }

  public async update(elementId: number, element: Despesas): Promise<Despesas> {
    const newIntoExpense = await this.primaClient.despesas.update({
      where: { id: elementId },
      data: {
        ...element,
      },
    });

    return newIntoExpense;
  }

  public async delete(elementId: number): Promise<Despesas> {
    const resultDeleteExpanse = await this.primaClient.despesas.delete({
      where: { id: elementId },
    });

    return resultDeleteExpanse;
  }

  async checkDuplicateDescriptionInSameMonth(descrition: string, date: Date): Promise<number> {
    const duplicateDescrition = await this.primaClient.despesas.count({
      where: {
        descricao: descrition,
        data: {
          gte: new Date(date.getFullYear(), date.getMonth(),  1),
          lte: new Date(date.getFullYear(), date.getMonth() + 1,  1),
        },
      },
    });

    return duplicateDescrition;
  }


  

}