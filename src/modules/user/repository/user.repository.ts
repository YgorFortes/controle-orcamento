/* eslint-disable @typescript-eslint/no-unused-vars */
import { Usuario } from '@prisma/client';
import { CrudRepository } from '../../../utils/abstract-class/repository/abstract.crud.repository';
export class UserRepository extends CrudRepository<Usuario> {
  findAll(filter: object): Promise<Array<Usuario>> {
    throw new Error('Method not implemented.');
  }

  findOne(elementId: number): Promise<Usuario | null> {
    throw new Error('Method not implemented.');
  }

  public findByLoginOrEmail(login?: string, email?: string): Promise<Usuario | null> {
    return this.primaClient.usuario.findFirst({
      where: {
        OR: [
          { login },
          { email },
        ],
      },
    });
  }

  create(element: Usuario): Promise<Usuario> {
    throw new Error('Method not implemented.');
  }

  update(elementId: number, element: Usuario): Promise<Usuario> {
    throw new Error('Method not implemented.');
  }

  delete(elementId: number): Promise<Usuario> {
    throw new Error('Method not implemented.');
  }
  
}