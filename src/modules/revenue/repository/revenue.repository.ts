import { CustomHttpError } from '../../../erros/custom.http.error';
import { CrudRepository } from '../../../utils/abstract-class/repository/abstract.crud.repository';
import { Receitas } from '@prisma/client';


export class RevenueRepository extends CrudRepository<Receitas> {

  public  findAll(filter?:  {  page?: number, limit?: number, descricao?: string }): Promise<Array<Receitas>> {
    const { page = 1, limit = 10, descricao } = filter ?? {};

    if (limit > 100) {
      throw new CustomHttpError('O limite máximo permitido para a pesquisa é de 100 registros por página.', 400);
    }
 
    return  this.primaClient.receitas.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: descricao ? { descricao: { contains: descricao } } : undefined,
    });
  }

  public  findOne(elementId: number): Promise<Receitas | null> {
    return this.primaClient.receitas.findUnique({
      where: { id: elementId },
    });
  }

  public  findRevenueByMonth(filter:  { ano: number, mes: number, page?: number, limit?: number }) : Promise<Array<Receitas>> {
    const { page = 1, limit = 10 } = filter ?? {};

    if (limit > 100) {
      throw new CustomHttpError('O limite máximo permitido para a pesquisa é de 100 registros por página.', 400);
    }
 
    return this.primaClient.receitas.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        data: {
          gte: new Date(filter.ano, filter.mes - 1, 1), 
          lte: new Date(filter.ano, filter.mes, 0), 
        },
      },
    });
  }


  public  create(dataRevenue: Receitas): Promise<Receitas>  {
    return this.primaClient.receitas.create({ data: dataRevenue });
  }
 

  public update(elementId: number, dataRevenue: Receitas): Promise<Receitas> {
    return this.primaClient.receitas.update({
      where: { id: elementId },
      data: {
        ...dataRevenue,
      },
    });
  }


  public  delete(elementId: number): Promise<Receitas> {
    return this.primaClient.receitas.delete({
      where: { id: elementId },
    });
  }
  

  public checkDuplicateDescriptionInSameMonth(descrition: string, date: Date): Promise<number> {
    return  this.primaClient.receitas.count({
      where: { 
        descricao: descrition, 
        data: {
          gte: new Date(date.getFullYear(), date.getMonth(),  1),
          lt: new Date(date.getFullYear(), date.getMonth() + 1,  1),
        },
      },
    });
  }

}