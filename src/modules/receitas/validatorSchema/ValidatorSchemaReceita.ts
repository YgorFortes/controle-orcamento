import { Receitas } from '@prisma/client';
import { date, number, string, object } from 'yup';

export class ValidatorSchemaRevenue {

  public async create(body: object) : Promise<Partial<Receitas>> {
    const revenueSchemaCreate = object({
      descricao: string().trim().lowercase().required('O campo descricao é obrigatório.'),
      valor: number().positive('O campo valor só recebe numeros positivos').required('O campo valor é obrigátorio'),
      data: date().typeError('Formato de data inválido').required('O campo data é obrigatorio'),
    }).noUnknown();

    const resultRevenueSchemaCreate = await revenueSchemaCreate.validate(body);
    return resultRevenueSchemaCreate;
  }

  public async findAll(query: object) : Promise<object> {
    const revenueSchemaFindAll = object({
      page: number().typeError('O campo page só recebe números.').integer('O campo page só recebe números inteiros.').positive('O campo page só recebe números positivos'),
      limit: number().typeError('O campo limit só recebe números.').integer('O campo limit só recebe números inteiros.').positive('O campo limit só recebe números positivos'),
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
} 