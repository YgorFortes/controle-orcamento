export interface InterfaceCrudService<T> {

  findAll(filter: T): Promise<T[]>;

  findOne(elementId: number) : Promise<T>;

  create(element: T) :Promise<T | undefined>;

  update(elementId: number, element: T): Promise<T>;

  delete(elementId: number) : Promise<T>;

}