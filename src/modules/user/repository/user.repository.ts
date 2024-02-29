/* eslint-disable @typescript-eslint/no-unused-vars */
import { Usuario } from '@prisma/client';
import { CrudRepository } from '../../../utils/abstract-class/repository/abstract.crud.repository';
export class UserRepository extends CrudRepository<Usuario> {
  findAll(filter: object): Promise<Array<Usuario>> {
    throw new Error('Method not implemented.');
  }

  public findOne(elementId: number): Promise<Usuario | null> {
    return this.primaClient.usuario.findUnique({
      where: {
        id: elementId,
      },
    });
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


  public create(element: Usuario): Promise<Usuario> {
    return this.primaClient.usuario.create({
      data: {
        ...element,
      },
    });
  }

  public update(elementId: number, element: Usuario): Promise<Usuario> {
    return this.primaClient.usuario.update({
      where: { id: elementId },
      data: { ...element },
    });
  }

  public delete(elementId: number): Promise<Usuario> {
    return this.primaClient.usuario.delete({
      where: { id: elementId },
    });
  }
  
}