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

describe('POST /receitas create revenue controller', ()=>{

  it('Should be create new revenue', async()=>{
    const newRevenue = {
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    };

    const reponse = await request(server).post("/api/v1/receitas")
    .send(newRevenue);

    expect(reponse.status).toBe(201)
    expect(reponse.body).toHaveProperty("id");
  });

  it('Should be not create new revenue if body is not passed.', async()=>{
    const newRevenue = {
    };
    const reponse = await request(server).post("/api/v1/receitas")
    .send(newRevenue);
    expect(reponse.status).toBe(400);
  });

  it('Should be not create new revenue if any body item is missing', async()=>{
    const newRevenue = {
      descricao: "Venda de produtos",
      valor: 1500,
    };

    const reponse = await request(server).post("/api/v1/receitas")
    .send(newRevenue);
    expect(reponse.status).toBe(400);
  });

  it('Should be not create new revenue if revenue descrition already exist', async()=>{

    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    const newRevenue = {
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    };


    const reponse = await request(server).post("/api/v1/receitas")
    .send(newRevenue);

    expect(reponse.status).toBe(400)
    expect(reponse.body).toEqual({ mensagem: 'Receita venda de produtos do mês Fevereiro já cadastrada.'})
  });

  it('Should be create new revenue if revenue description already exist, but not in the same month', async()=>{
    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    const newRevenue = {
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    };

    const reponse = await request(server).post("/api/v1/receitas")
    .send(newRevenue);

    expect(reponse.status).toBe(201)
    expect(reponse.body).toHaveProperty("id");
  })
});

describe('GET /receitas findAll revenue controller ', ()=>{
  it('Should be return array of revenues', async()=>{

    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });


    const response = await request(server).get("/api/v1/receitas");

    expect(response.status).toBe(200);

    response.body.forEach((element: object) => {
      expect(element).toHaveProperty("id");
    });

    expect(response.body).toBeInstanceOf(Array);
  });

  it('Should be revenue array return max 10 revenues if pagination not exist', async()=>{
    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });

    const response = await request(server).get("/api/v1/receitas");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });

  it('Should pagination work in revenue array', async()=>{
    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });

    const response = await request(server).get("/api/v1/receitas?page=1&limit=1");
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

    const response2 = await request(server).get("/api/v1/receitas?page=2&limit=1");
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

describe('GET /receitas/id findOne revenue controller', ()=>{
  it('Should be return revenue with details' ,async ()=>{
    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    const response = await request(server).get('/api/v1/receitas/1');

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id");
    expect(response.body).toMatchObject(
      {
        descricao: expect.stringMatching(/venda de produtos/i),
        valor: 1500,
        data: new Date('2024-02-14').toISOString()
      }
    )
  });

  it('Should be return message if revenue not exist', async()=>{
    const response = await request(server).get('/api/v1/receitas/6');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensagem: 'Receita não encontrada.'});
  })
});

describe('PUT /receitas/id update revenue controller',()=>{
  it('Should be update revenue', async()=>{

    const reponsePost = await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-07-14')
    });

    const idRevenue = reponsePost.body.id;

    const newInfoRevenue = {
      descricao: "Venda de comidas",
      valor: 2000,
      data: new Date('2024-01-14')
    }

    const reponse = await request(server).put(`/api/v1/receitas/${idRevenue}`)
    .send(newInfoRevenue);
  
    expect(reponse.status).toBe(200);
    expect(reponse.body).toMatchObject({
      id: idRevenue,
      descricao: expect.stringMatching(new RegExp(newInfoRevenue.descricao, 'i')),
      valor: newInfoRevenue.valor,
      data: new Date(newInfoRevenue.data).toISOString()
    });

  });

  it('Should be a message if descricao already exist in when updated', async()=>{
    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-07-14')
    });


    const reponsePost = await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de itens",
      valor: 1500,
      data: new Date('2024-07-14')
    });

    const idRevenue = reponsePost.body.id;

    const newInfoRevenue = {
      descricao: "Venda de produtos",
      valor: 2000,
      data: new Date('2024-07-14')
    }

    const reponse = await request(server).put(`/api/v1/receitas/${idRevenue}`)
    .send(newInfoRevenue);
    expect(reponse.status).toBe(400);
    expect(reponse.body).toEqual({ mensagem: 'Receita venda de produtos do mês Julho já cadastrada.' });
  })

  it('Should be a message if revenue not exist', async()=>{
    const newInfoRevenue = {
      descricao: "Venda de arroz",
      valor: 2000,
      data: new Date('2024-07-14')
    }

    const reponse = await request(server).put(`/api/v1/receitas/10000`)
    .send(newInfoRevenue);
    expect(reponse.status).toBe(200);
    expect(reponse.body).toEqual({ mensagem: 'Receita não encontrada.' });
  });

});

describe('DELETE /receitas/id delete revenue controller ', ()=>{
  it('Should be delete revenue', async()=>{
    const responsePost = await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-11-14')
    });

    const idRevenue = responsePost.body.id;
    
    const response = await request(server).delete(`/api/v1/receitas/${idRevenue}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensagem: 'Receita excluida com sucesso.' });
  });

  it('Should be message if revenue not exist', async()=>{

    const response = await request(server).delete(`/api/v1/receitas/1000000`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensagem: 'Receita não encontrada.'});
  });


})

//fechando o servidor depois de cada teste
afterEach(()=>{
	server.close();
});

