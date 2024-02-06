import { Receitas } from '@prisma/client';

export interface InterfaceRevenueUpdateValidation {
  params: number;
  body: Receitas;
}

export interface InterfaceRevenueSearchOptions  {
  ano: number,
  mes: number
  page?: number,
  limit?:number
}
