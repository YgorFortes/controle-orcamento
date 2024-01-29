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
} 