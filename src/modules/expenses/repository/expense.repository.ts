/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomHttpError } from '../../../erros/custom.http.error';
import { CrudRepository } from '../../../utils/abstract-class/repository/abstract.crud.repository';
import { Despesas } from '@prisma/client';

export class ExpenseRepository  extends CrudRepository<Despesas> {

  public async findAll(filter?:  {  page?: number, limit?: number, descricao?: string }): Promise<Array<Despesas>> {
    const { page = 1, limit = 10, descricao } = filter ?? {};

    if (limit > 100) {
      throw new CustomHttpError('O limite máximo permitido para a pesquisa é de 100 registros por página.', 400);
    }

    return this.primaClient.despesas.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: descricao ? { descricao: { contains: descricao } } : undefined,
    });
  }
 

  public async findOne(elementId: number): Promise<Despesas | null> {
    return this.primaClient.despesas.findUnique({
      where: {
        id: elementId,
      },
    });
  }

  
  public async create(dataExpense: Despesas): Promise<Despesas> {
    return  this.primaClient.despesas.create({
      data: dataExpense,
    });
  }


  public async update(elementId: number, element: Despesas): Promise<Despesas> {
    return  this.primaClient.despesas.update({
      where: { id: elementId },
      data: {
        ...element,
      },
    });
  }


  public async delete(elementId: number): Promise<Despesas> {
    return this.primaClient.despesas.delete({
      where: { id: elementId },
    });
  }


  async checkDuplicateDescriptionInSameMonth(descrition: string, date: Date): Promise<number> {
    return this.primaClient.despesas.count({
      where: {
        descricao: descrition,
        data: {
          gte: new Date(date.getFullYear(), date.getMonth(),  1),
          lte: new Date(date.getFullYear(), date.getMonth() + 1,  1),
        },
      },
    });
  }

}