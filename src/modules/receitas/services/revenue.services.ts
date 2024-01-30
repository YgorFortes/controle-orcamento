/* eslint-disable @typescript-eslint/no-unused-vars */
import { Receitas } from '@prisma/client';
import { InterfaceCrudService } from '../../../utils/interfaces/services/interface.service.crud';
import { RevenueRepository } from '../repository/revenue.repository';
import { ValidatorSchemaRevenue } from '../validatorSchema/ValidatorSchemaReceita';
import { CustomHttpError } from '../../../erros/custom.http.error';
import { Moth } from '../../../utils/enuns/moth';

export class RevenueService implements InterfaceCrudService<Receitas> {
  private validatorSchemaRevenue: ValidatorSchemaRevenue;

  private revenueRepository: RevenueRepository;

  constructor() {
    this.validatorSchemaRevenue = new ValidatorSchemaRevenue();
    this.revenueRepository = new RevenueRepository();
  }

  public  async findAll(filter?:  { page?: number, limit?: number }): Promise<Array<Receitas> | undefined> {
    try {
      const { page, limit } = filter ?? {};

      if (page && limit ) {
        return await this.pagination(page, limit);
      }

      const listRevenue = await this.revenueRepository.findAll();
      return listRevenue;
      
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  public findOne(elementId: number): Promise<Receitas> {
    throw new Error('Method not implemented.');
  }

  public async create(dataRevenue: Receitas): Promise<Receitas | undefined> {
    try {
      await this.validatorSchemaRevenue.create(dataRevenue);
      
      const checkDuplicateRevenue = await this.revenueRepository.checkDuplicateDescriptionInSameMonth(dataRevenue.descricao, dataRevenue.data);
 
      if (checkDuplicateRevenue > 0) {
        const mothName = this.getMonthName(dataRevenue.data);
        throw new CustomHttpError(`Receita ${dataRevenue.descricao} do mês ${mothName} já cadastrada`, 400);
      }
     
      const newRevenue = await this.revenueRepository.create({ ...dataRevenue });
      return newRevenue;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }



  public update(elementId: number, element: object): Promise<Receitas> {
    throw new Error('Method not implemented.');
  }

  public delete(elementId: number): Promise<Receitas> {
    throw new Error('Method not implemented.');
  }

  private getMonthName(date: Date): string {
    return Moth[date.getMonth() + 1]; 
  }

  private async pagination(page: number, limit: number ) : Promise<Array<Receitas> | undefined> {
    try {
      const listRevenuePagination =  await this.revenueRepository.pagination(page, limit);
      return listRevenuePagination;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

 
}