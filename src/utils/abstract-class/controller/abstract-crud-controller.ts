import { AbstractRouterController } from './abstract-router-controller.ts.js';
export abstract class AbstractCrudController extends AbstractRouterController {
  
  abstract findAll(): void;

  abstract findOne(): void;

  abstract create(): void;

  abstract update(): void;

  abstract delete(): void;

}