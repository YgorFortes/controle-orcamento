import { Despesas } from '@prisma/client';

export interface ExpenseUpdateValidation {
  params: number;
  body: Despesas;
}

export interface InterfaceExpenseSearchOptions  {
  ano: number,
  mes: number
  page?: number,
  limit?:number
}
