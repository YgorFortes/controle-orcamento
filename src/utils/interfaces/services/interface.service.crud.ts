export interface InterfaceCrudService<T> {

  findAll(filter: object): Promise<T[] | undefined>;

  findOne(elementId: number) : Promise<T | undefined>;

  create(element: T) :Promise<T | undefined>;

  update(elementId: number, element: T): Promise<T | undefined>;

  delete(elementId: number) : Promise<T>;

}