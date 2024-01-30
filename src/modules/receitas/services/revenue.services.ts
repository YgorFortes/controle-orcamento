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
      await this.validatorSchemaRevenue.findAll({ filter });

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

  public async findOne(elementId: number): Promise<Receitas | undefined > {
    try {
      await this.validatorSchemaRevenue.findOne({ id: elementId });

      const revenueDetails = await this.revenueRepository.findOne(elementId);

      if (!revenueDetails) {
        throw new CustomHttpError('Receita não encontrada.', 200);
      }
      return revenueDetails;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  public async create(dataRevenue: Receitas): Promise<Receitas | undefined> {
    try {
      await this.validatorSchemaRevenue.create(dataRevenue);
      
      await this.verifyUniqueMonthlyDescription(dataRevenue.descricao, dataRevenue.data);
     
      const newRevenue = await this.revenueRepository.create({ ...dataRevenue });
      return newRevenue;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }



  public async update(elementId: number, dataRevenue: Receitas): Promise<Receitas | undefined> {
    try {
      
      await this.validatorSchemaRevenue.update({ id: elementId }, { ...dataRevenue });

      await this.findOne(elementId);

      await this.verifyUniqueMonthlyDescription(dataRevenue.descricao, dataRevenue.data);

      const newInfoRevenue = await this.revenueRepository.update(elementId, dataRevenue);

      return newInfoRevenue;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }  
  
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

  private async verifyUniqueMonthlyDescription(descricao: string, data: Date) {
    try {
      const checkDuplicateRevenue = await this.revenueRepository.checkDuplicateDescriptionInSameMonth(descricao, data);
 
      if (checkDuplicateRevenue > 0) {
        const mothName = this.getMonthName(data);
        throw new CustomHttpError(`Receita ${descricao} do mês ${mothName} já cadastrada.`, 400);
      }
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

 
}