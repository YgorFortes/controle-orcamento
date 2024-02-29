import { Usuario } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';
import { CustomHttpError } from '../../../erros/custom.http.error';
import { UserValidateSchema } from '../validatorSchema/userSchema.validator';
import { UserService } from './user.services';

export class  AuthUserService extends UserService {
  protected userRepository: UserRepository;

  protected userSchemaValidator : UserValidateSchema;

  constructor() {
    super();
    this.userRepository = new UserRepository();
    this.userSchemaValidator = new UserValidateSchema();
  }

  public async update(newUserData: Partial<Usuario>, idUser: number): Promise<object | undefined>  {
    try {

      await this.userSchemaValidator.update(newUserData);

      await this.findOne(idUser);

      const { login = undefined, email = undefined } =  newUserData ?? {};

      await this.loginOrEmailUserExist(login, email);

      if (newUserData.senha) {
        return  await this.updateUserWithPassword(newUserData, idUser);
      }

      const userUpdateResult = await this.userRepository.update(idUser, { nome: newUserData.nome, login: newUserData.login, email: newUserData.email } as Usuario);

      if (userUpdateResult) {
        return { mensagem: 'Usuário atualizado com sucesso.' };
      }
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  private async findOne(idUser: number) : Promise<Usuario | undefined> {
    try {
      const user = await this.userRepository.findOne(idUser);

      if (!user) {
        throw new CustomHttpError('Usuário não existe', 401);
      }

      return user;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  public async delete(userData: { senha: string, confirmarSenha: string }, idUser: number): Promise<object | undefined> {
    try {
      await this.userSchemaValidator.delete(userData);
      const user = await this.findOne(idUser);

      if (user) {
        await this.validatePassWord(user.senha, userData.senha);

        const result = await this.userRepository.delete(user.id);
  
        if (!result) {
          throw new CustomHttpError('Não foi possível excluir usuário', 500);
        }
  
        return { mensagem: 'Usuário deletado com sucesso.' };
      }

    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  private async updateUserWithPassword(newUserData: Partial<Usuario>, idUser: number): Promise<object | undefined> {
    try {
      if (newUserData.senha) {
        const passwordHash = await this.encryptPassword(newUserData.senha);
        const userUpdateResult = await this.userRepository.update(idUser, { nome: newUserData.nome, login: newUserData.login, email: newUserData.email, senha: passwordHash } as Usuario);

        if (userUpdateResult) {
          return { mensagem: 'Usuário atualizado com sucesso.' };
        }

      }
    } catch (error) {
     
      CustomHttpError.checkAndThrowError(error);
    }
  }
}