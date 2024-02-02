import { CrudRepository } from '../../../utils/abstract-class/repository/abstract.crud.repository';
import { Receitas } from '@prisma/client';


export class RevenueRepository extends CrudRepository<Receitas> {

  public async findAll(filter?:  {  page?: number, limit?: number, descricao?: string }): Promise<Array<Receitas>> {
    const { page = 1, limit = 10, descricao } = filter ?? {};
 

    const listRevenue = await this.primaClient.receitas.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: descricao ? { descricao: { contains: descricao } } : undefined,
    });
    return listRevenue;
  }

  public async findOne(elementId: number): Promise<Receitas | null> {
    const revenueDetails = await this.primaClient.receitas.findUnique({
      where: { id: elementId },
    });

    return revenueDetails;
  }

  public async create(dataRevenue: Receitas): Promise<Receitas>  {
    const newRevenue = await this.primaClient.receitas.create({ data: dataRevenue });

    return newRevenue ;
  }
 
  public async update(elementId: number, dataRevenue: Receitas): Promise<Receitas> {
    const newInfoRevenue = await this.primaClient.receitas.update({
      where: { id: elementId },
      data: {
        ...dataRevenue,
      },
    });

    return newInfoRevenue;
  }

  public async delete(elementId: number): Promise<Receitas> {
    const result = await this.primaClient.receitas.delete({
      where: { id: elementId },
    });

    return result;
  }
  
  async checkDuplicateDescriptionInSameMonth(descrition: string, date: Date): Promise<number> {
    const duplicateDescrition = await  this.primaClient.receitas.count({
      where: { 
        descricao: descrition, 
        data: {
          gte: new Date(date.getFullYear(), date.getMonth(),  1),
          lt: new Date(date.getFullYear(), date.getMonth() + 1,  1),
        },
      },
    });
    
    return duplicateDescrition; 
  }

}