import { ExpenseService } from '../../expenses/services/expenses.services';
import { RevenueService } from '../../revenue/services/revenue.services';
import { CustomHttpError } from '../../../erros/custom.http.error';
import { InterfaceSummarySearchOptions } from '../../../utils/interfaces/validators/sumarySchema.interface';
import { Despesas } from '@prisma/client';


export class  SummaryService {
  private revenueService: RevenueService;

  private expenseService: ExpenseService;

  constructor() {
    this.revenueService = new RevenueService();
    this.expenseService = new ExpenseService();
  }

  public async sumary(summaryDates: InterfaceSummarySearchOptions): Promise<any> {
    try {
      const revenues = await this.revenueService.findRevenueByMonth(summaryDates);

      const expenses = await this.expenseService.findRevenueByMonth(summaryDates);
      
      if (!revenues?.length || !expenses?.length) {
        throw new CustomHttpError('Não encontrado receitas ou despesas nessse mês.', 200);
      }

      const totalRevenues = this.calculateTotalValue(revenues);
      const totalExpenses = this.calculateTotalValue(expenses);
      
      const finalBalance = this.calculateFinalBalance(totalRevenues, totalExpenses);


      const totalExpenseByCategory = this.totalForCategory(expenses);
      
      return { 
        valorTotalReceitas: totalRevenues, 
        valorTotalDespesas: totalExpenses,  
        saldoFinalDoMes: finalBalance, 
        totalPorCategoria: totalExpenseByCategory,
      };

    } catch (error) {
      CustomHttpError.checkAndThrowError(error);
    }
  }

  /**
   * Calculates the total value of revenues or expenses for a given month.
   * @template T - Type of the array elements, must have a 'valor' property of type number.
   * @param {Array<T>} array - An array of objects representing revenues or expenses.
   * @returns {number | undefined} - The total value of revenues or expenses for the given month, or undefined if an error occurs.
  */
  private calculateTotalValue<T extends { valor: number }>(array: Array<T>): number {
    const totalByMonth = array.reduce((accumulator, currentItem) => accumulator + currentItem.valor, 0);

    return totalByMonth;
  }

  /**
   * Calculates the final balance for the month based on the total revenues and total expenses.
   * 
   * @param {number} totalRevenues - Total revenues for the month.
   * @param {number} totalExpenses - Total expenses for the month.
   * @returns {number} - The final balance for the month.
  */
  private calculateFinalBalance(totalRevenues: number, totalExpenses: number): number {
    const finalBalance = totalRevenues - totalExpenses;
    return finalBalance;
  } 

  private totalForCategory(expenses: Array<Despesas>): object {

    const totalForCategory: { [categoria: string]: number } = {};
      
    for (const expense of expenses) {
      if (!totalForCategory[expense.categoria]) {
        totalForCategory[expense.categoria] = 0;
      }

      totalForCategory[expense.categoria] += expense.valor; 
    }

    return totalForCategory;
  
  }
}