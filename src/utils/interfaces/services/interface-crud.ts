export interface InterfaceCrudService {

  findAll(filter: object): Promise<object[]>;

  findOne(elementId: number) : Promise<object>;

  create(element: object) :Promise<object>;

  update(elementId: number, element: object): Promise<object>;

  delete(elementId: number) : Promise<object>;

}