import { Despesas } from '@prisma/client';

export interface ExpenseUpdateValidation {
  params: number;
  body: Despesas;
}