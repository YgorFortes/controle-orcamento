import { PrismaClient } from '@prisma/client';

export abstract class CrudRepository<T> {
  protected primaClient : PrismaClient;

  constructor() {
    this.primaClient = new PrismaClient();
  }

  abstract findAll(filter: object): Promise<Array<T>>;

  abstract findOne(elementId: number): Promise<T | null>;

  abstract create(element: T): Promise<T>;

  abstract update(elementId: number, element: T): Promise<T>; 

  abstract delete(elementId: number): Promise<T>;

}