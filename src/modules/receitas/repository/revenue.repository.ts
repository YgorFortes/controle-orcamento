
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CrudRepository } from '../../../utils/abstract-class/repository/abstract.crud.repository';
import { Receitas } from '@prisma/client';


export class RevenueRepository extends CrudRepository<Receitas> {


  async create(dataRevenue: Receitas): Promise<{ id: number; descricao: string; valor: number; data: Date; }> {
    const newRevenue = await this.primaClient.receitas.create({ data: dataRevenue });

    return newRevenue ;
  }

  async findAll(): Promise<Array<Receitas>> {
    const listRevenue = await this.primaClient.receitas.findMany();
    return listRevenue;
  }

  async pagination(page: number, limit: number): Promise<Array<Receitas>> {
    const listRevenue = await this.primaClient.receitas.findMany({
      take: limit,
      skip: (page - 1) * limit,
    });
    
    return listRevenue;
  }
  
  


  findOne(elementId: number): { id: number; descricao: string; valor: number; data: Date; } | null {
    throw new Error('Method not implemented.');
  }

  update(elementId: number, element: object): { id: number; descricao: string; valor: number; data: Date; } {
    throw new Error('Method not implemented.');
  }

  delete(elementId: number): number {
    throw new Error('Method not implemented.');
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