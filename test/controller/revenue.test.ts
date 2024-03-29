/**
 * @jest-environment ../../../prisma/prisma-enviroment-jest
*/

import app from '../../src/server'
import request from 'supertest'; 
import CustomEnvironment from '../../prisma/prisma-enviroment-jest'

let server: any;
//abrindo o servidor depois de cada teste
let token: string;
beforeAll(async ()=>{
  const port = 6000
  server = app.server.listen(port);

  await request(server).post('/api/v1/cadastrar').send({
    nome: "login da silva",
    login: "login",
    email: "naruto@gmail.com",
    senha: "123",
    confirmarSenha: "123"
  });

  const reponseLogin = await request(server).post('/api/v1/login').send({
    login: "login",
    senha: "123",
    confirmarSenha: "123"
  });

  token = reponseLogin.body.token;
});

describe('POST /receitas create revenue controller', ()=>{

  it('Should be  logged in', async()=>{
    const reponse = await request(server).post('/api/v1/receitas').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be create new revenue', async()=>{
    const newRevenue = {
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    };

    const reponse = await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send(newRevenue);

    expect(reponse.status).toBe(201)
    expect(reponse.body).toHaveProperty("id");
  });

  it('Should be not create new revenue if body is not passed.', async()=>{
    const newRevenue = {
    };

    const reponse = await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send(newRevenue);
    expect(reponse.status).toBe(400);
  });

  it('Should be not create new revenue if any body item is missing', async()=>{
    const newRevenue = {
      descricao: "Venda de produtos",
      valor: 1500,
    };

    const reponse = await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send(newRevenue);
    expect(reponse.status).toBe(400);
  });

  it('Should be not create new revenue if revenue descrition already exist', async()=>{

    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
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


    const reponse = await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send(newRevenue);

    expect(reponse.status).toBe(400)
    expect(reponse.body).toEqual({ mensagem: 'Receita venda de produtos do mês Fevereiro já cadastrada.'})
  });

  it('Should be create new revenue if revenue description already exist, but not in the same month', async()=>{
    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
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

    const reponse = await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send(newRevenue);

    expect(reponse.status).toBe(201)
    expect(reponse.body).toHaveProperty("id");
  })

});

describe('GET /receitas findAll revenue controller ', ()=>{

  it('Should be  logged in', async()=>{
    const reponse = await request(server).get('/api/v1/receitas').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be return array of revenues', async()=>{

    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });


    const response = await request(server).get("/api/v1/receitas").set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    response.body.forEach((element: object) => {
      expect(element).toHaveProperty("id");
    });

    expect(response.body).toBeInstanceOf(Array);
  });

  it('Should be revenue array return max 10 revenues if pagination not exist', async()=>{
    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });

    const response = await request(server).get("/api/v1/receitas").set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });

  it('Should pagination work in revenue array', async()=>{
    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });

    const response = await request(server).get("/api/v1/receitas?page=1&limit=1").set('Authorization', `Bearer ${token}`);
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

    const response2 = await request(server).get("/api/v1/receitas?page=2&limit=1").set('Authorization', `Bearer ${token}`);
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

  it('Should be return revenue if descrition match in query params', async()=>{
    await request(server).post("/api/v1/receitas")
    .send({
      descricao: "Salário Ygor",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Salário Larissa",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    const response = await request(server).get("/api/v1/receitas?descricao=Salário").set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    
    response.body.forEach((revenue: { descricao: string; })=>{
      expect(revenue.descricao).toMatch(/salário/i)
    });
  });

  
});

describe('GET /receitas/ano/mes', ()=>{

  it('Should be  logged in', async()=>{
    const reponse = await request(server).get('/api/v1/receitas/2021/05').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be list of revenue for month', async()=>{
    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Salário de roberta",
      valor: 1500,
      data: new Date('2024-01-02')
    });

    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Salário de carlos",
      valor: 1500,
      data: new Date('2024-01-02')
    });

    const response = await request(server).get('/api/v1/receitas/2024/01').set('Authorization', `Bearer ${token}`)
    response.body.forEach((revenue: {data:string} )=>{
      const revenueData = new Date(revenue.data);
      const month = revenueData.getMonth() +1;
      const year = revenueData.getFullYear()
      expect(year).toBe(2024);
      expect(month).toBe(1);
    })
  });

  it('Should be array empty of revenue for month', async()=>{

    const response = await request(server).get('/api/v1/receitas/2002/01').set('Authorization', `Bearer ${token}`)
    expect(response.status).toEqual(200)
    expect(response.body).toEqual([])
  });
})

describe('GET /receitas/id findOne revenue controller', ()=>{

  it('Should be  logged in', async()=>{
    const reponse = await request(server).get('/api/v1/receitas/6').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be return revenue with details' ,async ()=>{
    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    const response = await request(server).get('/api/v1/receitas/1').set('Authorization', `Bearer ${token}`);

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
    const response = await request(server).get('/api/v1/receitas/10000').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensagem: 'Receita não encontrada.'});
  })
});

describe('PUT /receitas/id update revenue controller',()=>{

  it('Should be  logged in', async()=>{
    const reponse = await request(server).put('/api/v1/receitas/5').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be update revenue', async()=>{

    const reponsePost = await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
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

    const reponse = await request(server).put(`/api/v1/receitas/${idRevenue}`).set('Authorization', `Bearer ${token}`)
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
    await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-07-14')
    });


    const reponsePost = await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
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

    const reponse = await request(server).put(`/api/v1/receitas/${idRevenue}`).set('Authorization', `Bearer ${token}`)
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

    const reponse = await request(server).put(`/api/v1/receitas/10000`).set('Authorization', `Bearer ${token}`)
    .send(newInfoRevenue);
    expect(reponse.status).toBe(200);
    expect(reponse.body).toEqual({ mensagem: 'Receita não encontrada.' });
  });

});

describe('DELETE /receitas/id delete revenue controller ', ()=>{

  it('Should be  logged in', async()=>{
    const reponse = await request(server).delete('/api/v1/receitas/7').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be delete revenue', async()=>{
    const responsePost = await request(server).post("/api/v1/receitas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-11-14')
    });

    const idRevenue = responsePost.body.id;
    
    const response = await request(server).delete(`/api/v1/receitas/${idRevenue}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensagem: 'Receita excluida com sucesso.' });
  });

  it('Should be message if revenue not exist', async()=>{

    const response = await request(server).delete(`/api/v1/receitas/1000000`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensagem: 'Receita não encontrada.'});
  });


})

//fechando o servidor depois de cada teste
afterAll(()=>{
	server.close();
});

