/**
 * @jest-environment ../../../prisma/prisma-enviroment-jest
*/

import app from '../../src/server'
import request from 'supertest'; 
import CustomEnvironment from '../../prisma/prisma-enviroment-jest'

let server: any;
//abrindo o servidor depois de cada teste
beforeEach(()=>{
  const port = 6000
  server = app.server.listen(port)
});

describe('GET /resumo/ano/mes',()=>{
  it('Should be return summary of month with Total revenue in the month, total expenses in the month, final balance in the month, total spent in each category for the month', async()=>{

    const reponseExpense1 = await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Ifood",
      valor: 200,
      data: new Date('2024-02-10'),
      categoria: "alimentacao"
    });

    const reponseExpense2 = await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Uber",
      valor: 150,
      data: new Date('2024-02-20'),
      categoria: "Transporte"
    });

    const reponseExpense3 =await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Compras do mês",
      valor: 800,
      data: new Date('2024-02-03'),
      categoria: "alimentacao"
    });

    const repsonseRevenue1 = await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Salário do Ygor",
      valor: 1402,
      data: new Date('2024-02-05'),
    });

    const repsonseRevenue2 = await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Salário da Larissa",
      valor: 1402,
      data: new Date('2024-02-07'),
    });

    const totalRevenues = (repsonseRevenue1.body.valor + repsonseRevenue2.body.valor);

    const totalExpenses = (reponseExpense1.body.valor + reponseExpense2.body.valor + reponseExpense3.body.valor);

    const balanceMonth = (totalRevenues - totalExpenses)

    const response = await request(server).get("/api/v1/resumo/2024/02");
    expect(response.status).toBe(200)
    expect(response.body.valorTotalReceitas).toBe(totalRevenues);
    expect(response.body.valorTotalDespesas).toBe(totalExpenses);
    expect(response.body.saldoFinalDoMes).toBe(balanceMonth);
    expect(response.body.totalPorCategoria.alimentacao).toBe((reponseExpense1.body.valor + reponseExpense3.body.valor))
  })

  it('Should be return a message if revenue or expense not found', async()=>{

    const response = await request(server).get("/api/v1/resumo/2002/02");


    expect(response.status).toBe(200)
    expect(response.body).toEqual({ mensagem: 'Não encontrado receitas ou despesas nessse mês.' });

  })
});


//fechando o servidor depois de cada teste
afterEach(()=>{
	server.close();
});