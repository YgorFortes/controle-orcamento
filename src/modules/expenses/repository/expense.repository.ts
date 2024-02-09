import { CustomHttpError } from '../../../erros/custom.http.error';
import { CrudRepository } from '../../../utils/abstract-class/repository/abstract.crud.repository';
import { Despesas } from '@prisma/client';

export class ExpenseRepository  extends CrudRepository<Despesas> {

  public  findAll(filter?:  {  page?: number, limit?: number, descricao?: string }): Promise<Array<Despesas>> {
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
 

  public  findOne(elementId: number): Promise<Despesas | null> {
    return this.primaClient.despesas.findUnique({
      where: {
        id: elementId,
      },
    });
  }


  public  findExpanseByMonth(filter:  { ano: number, mes: number, page?: number, limit?: number }) : Promise<Array<Despesas>> {
   
    return this.primaClient.despesas.findMany({
      where: {
        data: {
          gte: new Date(filter.ano, filter.mes - 1, 1), 
          lte: new Date(filter.ano, filter.mes, 0), 
        },
      },
    });
  }

  
  public  create(dataExpense: Despesas): Promise<Despesas> {
    return  this.primaClient.despesas.create({
      data: dataExpense,
    });
  }


  public  update(elementId: number, element: Despesas): Promise<Despesas> {
    return  this.primaClient.despesas.update({
      where: { id: elementId },
      data: {
        ...element,
      },
    });
  }


  public  delete(elementId: number): Promise<Despesas> {
    return this.primaClient.despesas.delete({
      where: { id: elementId },
    });
  }


  public checkDuplicateDescriptionInSameMonth(descrition: string, date: Date): Promise<number> {
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