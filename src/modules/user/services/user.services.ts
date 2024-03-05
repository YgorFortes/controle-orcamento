import { Usuario } from '@prisma/client';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { UserRepository } from '../repository/user.repository';
import { CustomHttpError } from '../../../erros/custom.http.error';
import { UserValidateSchema } from '../validatorSchema/userSchema.validator';

export class UserService {
  protected userRepository: UserRepository;

  protected userSchemaValidator : UserValidateSchema;

  constructor() {
    this.userRepository = new UserRepository();
    this.userSchemaValidator = new UserValidateSchema();
  }

  public async login(loginValue: { login?: string, email?: string, senha: string }) : Promise<Partial<Usuario> & { token?: string } | undefined> {

    try {

      await this.userSchemaValidator.login(loginValue);  
          
      const user = await this.userRepository.findByLoginOrEmail(loginValue.login, loginValue.email);

      if (!user) {
        throw new CustomHttpError('Credenciais inválidas', 401);
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

  

  protected async validatePassWord(passwordUser: string, passwordTyped: string): Promise<void> {
    try {
      const validatePassWord = await bcrypt.compare(passwordTyped, passwordUser);

      if (!validatePassWord) {
        throw new CustomHttpError('Não autorizado', 401);
      }
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  protected createToken(id: number) : string | undefined {
    try {
      const payLoad = { id };

      const secret = process.env.SECRET;

      if (!secret) {
        throw new Error('A secret deve ser fornecida para gerar o token token.');
      }

      const token = jsonwebtoken.sign(payLoad, secret, { expiresIn: '1w' } );
      return token;
    } catch (error) {
      console.log(error);
      CustomHttpError.checkAndThrowError(error);
    }
  }

  public async create(userData: Usuario) : Promise<object | undefined> {
    try {
      await this.userSchemaValidator.register({ ...userData, confirmarSenha: userData.senha });
      const { senha } = userData;


      await this.loginOrEmailUserExist(userData.login, userData.email);

      const passwordHash = await this.encryptPassword(senha);

      const newUser = await this.userRepository.create({ nome: userData.nome, login: userData.login, email: userData.email, senha: passwordHash } as Usuario);

      if (!newUser) {
        throw new CustomHttpError('Não foi possível registrar o usuário', 500);
      }

      const token = this.createToken(newUser.id);
      
      return { mensagem: 'Usuário cadastrado com sucesso', token };
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  protected async encryptPassword(password: string): Promise<string | undefined> {
    try {
      
      const salt = await bcrypt.genSalt(12);

      const passwordHash = await bcrypt.hash(password, salt);

      if (!passwordHash) {
        throw new CustomHttpError('Não foi possivél criar o hash da senha', 500);
      }

      return passwordHash;
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  

  protected async loginOrEmailUserExist(login?: string, email?: string) {
    try {
   
      const userLoginOrEmail = await this.userRepository.findByLoginOrEmail(login, email);
      if (userLoginOrEmail) {
        throw new CustomHttpError('O usuário já está cadastrado. Utilize um login ou e-mail diferente para criar uma nova conta.', 409);
      }
    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

 



}