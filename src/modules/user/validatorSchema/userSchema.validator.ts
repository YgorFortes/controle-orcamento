import { object, ref, string } from 'yup';

export class UserValidateSchema {
  public async login(bodyValue: object):  Promise<object> {
    const authSchema = object({
      login: string().matches(/^[^\s]+$/, 'O campo login não pode conter espaços entre os caracteres.'),
      email: string().email('O campo precisa ser um email válido.').trim().lowercase(),
      senha: string().trim().required('O campo senha é obrigatório.').matches(/^[^\s]+$/, 'O campo senha não pode conter espaços entre os caracteres.'),
    }).test('emailOrLogin', 'Deve fornecer email ou login.', (body) => Boolean(body.login || body.email)).noUnknown();

    return authSchema.validateSync(bodyValue);
  } 

  public async register(bodyValue: object): Promise<object> {
    const registerSchema = object({
      nome: string().trim().required('O campo nome é obrigatório.').min(2, 'O campo nome dever ter no minimo 2 caracteres.').max(50, 'O campo nome dever ter no máximo 2 caracteres.'),
      login: string().matches(/^[^\s]+$/, 'O campo login não pode conter espaços entre os caracteres.').required('O campo login é obrigatório.'),
      email: string().email('O campo precisa ser um email válido.').trim().lowercase().required('O campo email é obrigatório.'),
      senha: string().trim().required('O campo senha é obrigatório.').matches(/^[^\s]+$/, 'O campo senha não pode conter espaços entre os caracteres.'),
      confirmarSenha: string().trim().required('O campo confirmarSenha é obrigatório.').matches(/^[^\s]+$/, 'O campo senha não pode conter espaços entre os caracteres.').oneOf([ref('senha')], 'As senhas devem corresponder'),
    }).noUnknown();

    return  registerSchema.validateSync(bodyValue);
  }

  public async update(bodyValue: object): Promise<object> {
    const registerSchema = object({
      nome: string().trim().min(2, 'O campo nome dever ter no minimo 2 caracteres.').max(50, 'O campo nome dever ter no máximo 2 caracteres.'),
      login: string().matches(/^[^\s]+$/, 'O campo login não pode conter espaços entre os caracteres.'),
      email: string().email('O campo precisa ser um email válido.').trim().lowercase(),
      senha: string().trim().matches(/^[^\s]+$/, 'O campo senha não pode conter espaços entre os caracteres.'),
      confirmarSenha: string()
        .trim()
        .when('senha', (senha, schema) => {
          if (!senha.includes(undefined)) {
            return schema.oneOf([ref('senha')], 'As senhas devem corresponder').required('O campo confirmarSenha é obrigatório') ;
          }
          return schema;
        }),
    }).noUnknown();

    return  registerSchema.validateSync(bodyValue);
  }

  public async delete(bodyValue: object): Promise<object>  {
    const deleteSchema = object({
      senha: string().trim().required('O campo senha é obrigatório.').matches(/^[^\s]+$/, 'O campo senha não pode conter espaços entre os caracteres.'),
      confirmarSenha: string().trim().required('O campo confirmarSenha é obrigatório.').matches(/^[^\s]+$/, 'O campo senha não pode conter espaços entre os caracteres.').oneOf([ref('senha')], 'As senhas devem corresponder'),
    }).noUnknown();

    return deleteSchema.validateSync(bodyValue);
  }

}