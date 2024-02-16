import { Usuario } from '@prisma/client';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { UserRepository } from '../repository/user.repository';
import { CustomHttpError } from '../../../erros/custom.http.error';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async login(loginValue: { login?: string, email?: string, senha: string }) : Promise<Partial<Usuario> & { token?: string } | undefined> {

    try {
      const user = await this.userRepository.findByLoginOrEmail(loginValue.login, loginValue.email);

      if (!user) {
        throw new CustomHttpError('Credenciais inválidas', 200);
      }

      await this.validatePassWord(user.senha, loginValue.senha);

      const token = this.createToken(user.id);

      return {
        token,
        login: user.login,
        nome: user.nome,
      };

    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  private async validatePassWord(passwordUser: string, passwordTyped: string): Promise<void> {
    try {
      const validatePassWord = await bcrypt.compare(passwordTyped, passwordUser);

      if (!validatePassWord) {
        throw new CustomHttpError('Não autorizado', 401);
      }
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  private createToken(id: number) : string | undefined {
    try {
      const payLoad = { id };

      const secret = process.env.SECRET;

      if (!secret) {
        throw new Error('A secret deve ser fornecida para gerar o token token.');
      }

      const token = jsonwebtoken.sign(payLoad, secret );

      return token;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }
}