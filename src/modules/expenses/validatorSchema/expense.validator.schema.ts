import { Despesas } from '@prisma/client';
import { date, number, string, object } from 'yup';


export class ExpenseValidatorSchema {

  public async create(body: object): Promise<Partial<Despesas>> {
    const expenseBodyValidator   = object({
      descricao: string().trim().lowercase().required('O campo descricao é obrigatório.'),
      valor: number().positive('O campo valor só recebe numeros positivos').required('O campo valor é obrigátorio'),
      data: date().typeError('Formato de data inválido').required('O campo data é obrigatorio'),
    }).noUnknown();

    const result = await expenseBodyValidator.validate(body);
    return result  ;
  }

  public async findAll(query: object) : Promise<object> {
    const revenueSchemaFindAll = object({
      page: number().typeError('O campo page só recebe números.').integer('O campo page só recebe números inteiros.').positive('O campo page só recebe números positivos'),
      limit: number().typeError('O campo limit só recebe números.').integer('O campo limit só recebe números inteiros.').positive('O campo limit só recebe números positivos'),
    }).noUnknown();

    const resultRevenueSchemaFindAll = await revenueSchemaFindAll.validate(query);
    return resultRevenueSchemaFindAll;
  }
}