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

describe('POST /despesas create expanse controller', ()=>{
  it('Should be create new expanse', async()=>{
    const newExpanse = {
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    };

    const reponse = await request(server).post("/api/v1/despesas")
    .send(newExpanse);

    expect(reponse.status).toBe(201)
    expect(reponse.body).toHaveProperty("id");
  });

  it('Should be not create new expense if body is not passed.', async()=>{
    const newExpanse = {
    };
    const reponse = await request(server).post("/api/v1/despesas")
    .send(newExpanse);
    expect(reponse.status).toBe(400);
  });

  it('Should be not create new expanse if any body item is missing', async()=>{
    const newExpanse = {
      descricao: "Venda de produtos",
      valor: 1500,
    };

    const reponse = await request(server).post("/api/v1/despesas")
    .send(newExpanse);
    expect(reponse.status).toBe(400);
  });

  it('Should be not create new expanse if expanse descrition already exist', async()=>{

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    const newExpanse = {
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    };


    const reponse = await request(server).post("/api/v1/despesas")
    .send(newExpanse);

    expect(reponse.status).toBe(400)
    expect(reponse.body).toEqual({ mensagem: 'Despesa venda de produtos do mês Fevereiro já cadastrada.'})
  });

  it('Should be create new expense if expense description already exist, but not in the same month', async()=>{
    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    const newExpanse = {
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    };

    const reponse = await request(server).post("/api/v1/despesas")
    .send(newExpanse);

    expect(reponse.status).toBe(201)
    expect(reponse.body).toHaveProperty("id");
  })
});

describe('GET /despesas findAll expense controller ', ()=>{
  it('Should be return array of expenses', async()=>{

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });


    const response = await request(server).get("/api/v1/despesas");

    expect(response.status).toBe(200);

    response.body.forEach((element: object) => {
      expect(element).toHaveProperty("id");
    });

    expect(response.body).toBeInstanceOf(Array);
  });

  it('Should be revenue array return max 10 expanses if pagination not exist', async()=>{
    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-04-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-05-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-06-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-07-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-08-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-09-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-10-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-11-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-12-14')
    });

    const response = await request(server).get("/api/v1/despesas");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });

  it('Should pagination work in expanse array', async()=>{
    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });

    const response = await request(server).get("/api/v1/despesas?page=1&limit=1");
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
    response.body.forEach((revenue: object) => {
      expect(revenue).toHaveProperty("id");
      expect(revenue).toMatchObject(
        {
          descricao: expect.stringMatching(/venda de produtos/i),
          valor: 1500,
          data: new Date('2024-02-14').toISOString()
        }
      )
    });

    const response2 = await request(server).get("/api/v1/despesas?page=2&limit=1");
    response2.body.forEach((revenue: object) => {
      expect(revenue).toHaveProperty("id");
      expect(revenue).toMatchObject(
        {
          descricao: expect.stringMatching(/venda de produtos/i),
          valor: 1500,
          data: new Date('2024-03-14').toISOString()
        }
      )
    });
  })

});

describe('GET /despesas/id findOne revenue controller', ()=>{
  it('Should be return expases with details' ,async ()=>{
    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    const response = await request(server).get('/api/v1/despesas/1');

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id");
    expect(response.body).toMatchObject(
      {
        descricao: expect.stringMatching(/venda de produtos/i),
        valor: 1500,
        data: new Date('2024-02-14').toISOString()
      }
    )
  })

  it('Should be return message if revenue not exist', async()=>{
    const response = await request(server).get('/api/v1/despesas/6000');

    expect(response.status).toBe(200);
  
    expect(response.body).toEqual({ mensagem: 'Despesa não encontrada.'});
  })
});

describe('PUT /despesas/id update expanse controller', ()=>{
  it('Should be update expanse', async()=>{

    const reponsePost = await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de comidas",
      valor: 1500,
      data: new Date('2024-07-14')
    });
    
    
    const idExpanse = reponsePost.body.id;

    const newInfoExpanse = {
      descricao: "Venda de comidas",
      valor: 2000,
      data: new Date('2024-01-14')
    }

    const reponse = await request(server).put(`/api/v1/despesas/${idExpanse}`)
    .send(newInfoExpanse);
    
    expect(reponse.status).toBe(200);
    expect(reponse.body).toMatchObject({
      id: idExpanse,
      descricao: expect.stringMatching(new RegExp(newInfoExpanse.descricao, 'i')),
      valor: newInfoExpanse.valor,
      data: new Date(newInfoExpanse.data).toISOString()
    });

  });

  it('Should be a message if descricao already exist in when updated', async()=>{
    await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-07-14')
    });


    const reponsePost = await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de itens",
      valor: 1500,
      data: new Date('2024-07-14')
    });

    const idExpanse = reponsePost.body.id;

    const newInfoExpanse = {
      descricao: "Venda de produtos",
      valor: 2000,
      data: new Date('2024-07-14')
    }

    const reponse = await request(server).put(`/api/v1/despesas/${idExpanse}`)
    .send(newInfoExpanse);
    expect(reponse.status).toBe(400);
    expect(reponse.body).toEqual({ mensagem: 'Despesa venda de produtos do mês Julho já cadastrada.' });
  })

  it('Should be a message if expanse not exist', async()=>{
    const newInfoExpanse = {
      descricao: "Venda de arroz",
      valor: 2000,
      data: new Date('2024-07-14')
    }

    const reponse = await request(server).put(`/api/v1/despesas/10000`)
    .send(newInfoExpanse);
    expect(reponse.status).toBe(200);
    expect(reponse.body).toEqual({ mensagem: 'Despesa não encontrada.' });
  });
})

describe('DELETE /receitas/id delete revenue controller', ()=>{
  it('Should be delete expanse', async()=>{
    const responsePost = await request(server).post("/api/v1/despesas")
    .send({
      descricao: "Venda de roupas",
      valor: 1500,
      data: new Date('2024-11-14')
    });

    const idExpanse = responsePost.body.id;
    
    const response = await request(server).delete(`/api/v1/despesas/${idExpanse}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensagem: 'Despesa excluida com sucesso.' });
  });

  it('Should be message if expanse not exist', async()=>{

    const response = await request(server).delete(`/api/v1/despesas/1000000`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensagem: 'Despesa não encontrada.'});
  });

})


//fechando o servidor depois de cada teste
afterEach(()=>{
	server.close();
});