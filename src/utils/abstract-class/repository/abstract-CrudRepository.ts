import { PrismaClient } from '@prisma/client';

export abstract class CrudRepository<T> {
  protected primaClient : PrismaClient;

  constructor() {
    this.primaClient = new PrismaClient();
  }

  abstract findAll(filter: object):  Array<T> | Array<null>;

  abstract findOne(elementId: number): T | null;

  abstract create(element: object): T;

  abstract update(elementId: number, element: object): T; 

  abstract delete(elementId: number): number;

}