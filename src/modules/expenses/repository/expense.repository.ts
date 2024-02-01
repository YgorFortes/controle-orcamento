/* eslint-disable @typescript-eslint/no-unused-vars */
import { CrudRepository } from '../../../utils/abstract-class/repository/abstract.crud.repository';
import { Despesas } from '@prisma/client';

export class ExpenseRepository  extends CrudRepository<Despesas> {

  public async findAll(): Promise<Array<Despesas>> {
    const expenses = await this.primaClient.despesas.findMany();
    return expenses;
  }

  public async pagination(page: number = 1, limit: number = 10) :Promise<Array<Despesas>> {
    const expensesPaginated = await this.primaClient.despesas.findMany({
      take: limit,
      skip: ( page -  1) * limit,
    });
    return expensesPaginated;
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