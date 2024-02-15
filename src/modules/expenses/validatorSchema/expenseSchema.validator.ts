import { Despesas } from '@prisma/client';
import { date, number, string, object } from 'yup';
import { Category } from '../../../utils/enuns/category';


export class ExpenseValidatorSchema {

  public async create(body: object): Promise<Partial<Despesas>> {
    const expenseBodyValidator   = object({
      descricao: string().trim().lowercase().required('O campo descricao é obrigatório.'),
      valor: number().positive('O campo valor só recebe numeros positivos').required('O campo valor é obrigátorio'),
      data: date().typeError('Formato de data inválido').required('O campo data é obrigatorio'),
      categoria: string().trim().oneOf(Object.values(Category), `Categoria inválida. Por favor, escolha uma destas opções: ${ Object.values(Category)}`).lowercase(),
    }).noUnknown();

    const result = await expenseBodyValidator.validate(body);
    return result  ;
  }

  public async findAll(query: object) : Promise<object> {
    const revenueSchemaFindAll = object({
      page: number().typeError('O campo page só recebe números.').integer('O campo page só recebe números inteiros.').positive('O campo page só recebe números positivos'),
      limit: number().typeError('O campo limit só recebe números.').integer('O campo limit só recebe números inteiros.').positive('O campo limit só recebe números positivos'),
      descricao: string().trim().lowercase(),
    }).noUnknown();

    const resultRevenueSchemaFindAll = await revenueSchemaFindAll.validate(query);
    return resultRevenueSchemaFindAll;
  }

  public async findOne(params: object): Promise<number> {
    const revenueSchemaFindOne = object({
      id: number().typeError('O campo id só recebe números.').
        integer('O campo id só recebe números inteiros.').positive('O campo id só recebe números positivos')
        .required('O campo id no params é obrigátorio'),
    }).noUnknown();

    const resultRevenueSchemaFindOne = await revenueSchemaFindOne.validate(params);
    return resultRevenueSchemaFindOne.id;
  }

  public async update(params: object, body: object): Promise<object> {
    const revenueBody = await this.create(body);
    const revenueId = await this.findOne(params);

    return { params: revenueId, body: revenueBody };
  }

  public async delete(params: object): Promise<number> {
    const revenueId = await this.findOne(params);
    return revenueId;
  }
  
  /**
    Validates and merges expense filters provided in the parameters and query.
    @param params Filter parameters provided in the parameters.
    @param query Query filters provided in the query.
    @returns An object that merges the validation results of the parameters and query.
  */
 
  public async validateAndMergeExpenseFilters(params: object, query: object):  Promise<object> {
    const revenueParamsSchema  = object({
      ano: number().typeError('O campo ano só recebe números.').integer('O campo ano só recebe números inteiros.')
        .positive('O campo ano só recebe números positivos').min(1900, 'O campo ano deve ser maior ou igual a 1900.')
        .required('O campo ano no params é obrigátorio'),

      mes: number().typeError('O campo mês só recebe números.').integer('O campo mês só recebe números inteiros.')
        .positive('O campo mês só recebe números positivos').max(12, 'O campo mês deve estar entre 1 e 12, representando os meses do ano.')
        .min(1, 'O campo mês deve estar entre 1 e 12, representando os meses do ano.')
        .required('O campo mês no params é obrigátorio'),
    }).noUnknown();

    const revenueQuerySchema  = object({
      page: number().typeError('O campo page só recebe números.').integer('O campo page só recebe números inteiros.').positive('O campo page só recebe números positivos'),

      limit: number().typeError('O campo limit só recebe números.').integer('O campo limit só recebe números inteiros.').positive('O campo limit só recebe números positivos'),
    }).noUnknown();

    const resultParams = await revenueParamsSchema .validate(params);
    const resultQuery = await revenueQuerySchema .validate(query);

    return { ...resultParams, ...resultQuery };
  }
}