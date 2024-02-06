import { Receitas } from '@prisma/client';
import { InterfaceCrudService } from '../../../utils/interfaces/services/interface.service.crud';
import { RevenueRepository } from '../repository/revenue.repository';
import { RevenueValidatorSchema } from '../validatorSchema/revenueSchema.validator';
import { CustomHttpError } from '../../../erros/custom.http.error';
import { Moth } from '../../../utils/enuns/moth';

export class RevenueService implements InterfaceCrudService<Receitas> {
  private validatorSchemaRevenue: RevenueValidatorSchema;

  private revenueRepository: RevenueRepository;

  constructor() {
    this.validatorSchemaRevenue = new RevenueValidatorSchema();
    this.revenueRepository = new RevenueRepository();
  }

  public  async findAll(filter?:  object): Promise<Array<Receitas> | undefined> {
    try {
      await this.validatorSchemaRevenue.findAll({ filter });


      const listRevenue = await this.revenueRepository.findAll(filter);
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

  public async findRevenueByMonth(filterDate:  { ano: number, mes: number, page?: number, limit?: number }):  Promise<Array<Receitas> | undefined> {
    try {
      await this.validatorSchemaRevenue.validateAndMergeRevenueFilters({ ...filterDate }, { ...filterDate });

      return await this.revenueRepository.findRevenueByMonth({ ...filterDate });
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

  public async delete(elementId: number): Promise<object | undefined> {
    try {
      await this.validatorSchemaRevenue.delete({ id: elementId });

      await this.findOne(elementId);

      const result = await this.revenueRepository.delete(elementId);

      if (!result) {
        throw new CustomHttpError('Erro ao tentar deletar receita.');
      }

      return { mensagem: 'Receita excluida com sucesso.' };
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  private getMonthName(date: Date): string {
    return Moth[date.getMonth() + 1]; 
  }

  private async verifyUniqueMonthlyDescription(descricao: string, data: Date) : Promise<void> {
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