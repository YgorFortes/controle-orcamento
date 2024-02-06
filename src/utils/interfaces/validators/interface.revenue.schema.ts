import { Receitas } from '@prisma/client';

export interface RevenueUpdateValidation {
  params: number;
  body: Receitas;
}

export interface RevenuefindRevenueForMonth {
  ano: number,
  mes: number
  page?: number,
  limit?:number
}
