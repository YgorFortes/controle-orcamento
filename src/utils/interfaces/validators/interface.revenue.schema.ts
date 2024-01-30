import { Receitas } from '@prisma/client';

export interface RevenueUpdateValidation {
  params: number;
  body: Receitas;
}
