import { object, number } from 'yup';
export class SummaryValidatorSchema {
  /**
    Validates and merges expense filters provided in the parameters and query.
    @param params Filter parameters provided in the parameters.
    @param query Query filters provided in the query.
    @returns An object that merges the validation results of the parameters and query.
  */
  public async validateSumary(params: object):  Promise<object> {
    const revenueParamsSchema  = object({
      ano: number().typeError('O campo ano só recebe números.').integer('O campo ano só recebe números inteiros.')
        .positive('O campo ano só recebe números positivos').min(1900, 'O campo ano deve ser maior ou igual a 1900.')
        .required('O campo ano no params é obrigátorio'),
  
      mes: number().typeError('O campo mês só recebe números.').integer('O campo mês só recebe números inteiros.')
        .positive('O campo mês só recebe números positivos').max(12, 'O campo mês deve estar entre 1 e 12, representando os meses do ano.')
        .min(1, 'O campo mês deve estar entre 1 e 12, representando os meses do ano.')
        .required('O campo mês no params é obrigátorio'),
    }).noUnknown();
  

  
    return  revenueParamsSchema .validateSync(params);

  }
}