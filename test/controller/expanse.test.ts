/**
 * @jest-environment ../../../prisma/prisma-enviroment-jest
*/

import app from '../../src/server'
import request from 'supertest'; 


let server: any;
let token: string
//abrindo o servidor depois de cada teste
beforeAll(async()=>{
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

describe('POST /despesas create expanse controller', ()=>{
  it('Should be  logged in', async()=>{
    const reponse = await request(server).post('/api/v1/despesas').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be create new expanse', async()=>{
    const newExpanse = {
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    };

    const reponse = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send(newExpanse);

    expect(reponse.status).toBe(201)
    expect(reponse.body).toHaveProperty("id");
  });

  it('Category in expenses should only receive Alimentação Saúde, Moradia, Transporte, Educação, Lazer, Imprevistos, Outras ', async()=>{
    const newExpanse = {
      descricao: "arroz",
      valor: 1500,
      data: new Date('2024-02-14'),
      categoria: 'Qualquer categoria'
    };

    const reponse = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send(newExpanse);
    expect(reponse.status).toBe(400);
    expect(reponse.body).toEqual({ mensagem: 'Categoria inválida. Por favor, escolha uma destas opções: alimentacao,saude,moradia,transporte,educacao,lazer,imprevistos,outras'});
    await request(server).delete(`/api/v1/despesas/${reponse.body.id}`).set('Authorization', `Bearer ${token}`);
  });

  it('Category in expense Category in expenses should only receive alimentacao saude, moradia, transporte, educacao, lazer, imprevistos, outras', async()=>{
    const newExpanse = {
      descricao: "arroz",
      valor: 1500,
      data: new Date('2024-02-14'),
      categoria: 'alimentacao'
    };

    const reponse = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send(newExpanse);
    expect(reponse.status).toBe(201);
    expect(reponse.body.categoria).toBe('alimentacao')
    await request(server).delete(`/api/v1/despesas/${reponse.body.id}`).set('Authorization', `Bearer ${token}`);
  })

  it('if category in expense is empty category receveid Outras', async()=>{
    const newExpanse = {
      descricao: "Comida show",
      valor: 1500,
      data: new Date('2024-02-14'),
    };

    const reponse = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send(newExpanse);
    expect(reponse.status).toBe(201);
    expect(reponse.body.categoria).toBe('outras')
    await request(server).delete(`/api/v1/despesas/${reponse.body.id}`).set('Authorization', `Bearer ${token}`);
  })

  it('Should be not create new expense if body is not passed.', async()=>{
    const newExpanse = {
    };

    const reponse = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send(newExpanse);
    expect(reponse.status).toBe(400);
  });

  it('Should be not create new expanse if any body item is missing', async()=>{
    const newExpanse = {
      descricao: "Venda de produtos",
      valor: 1500,
    };

    const reponse = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send(newExpanse);
    expect(reponse.status).toBe(400);
  });

  it('Should be not create new expanse if expanse descrition already exist', async()=>{

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
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


    const reponse = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send(newExpanse);

    expect(reponse.status).toBe(400)
    expect(reponse.body).toEqual({ mensagem: 'Despesa venda de produtos do mês Fevereiro já cadastrada.'})
  });

  it('Should be create new expense if expense description already exist, but not in the same month', async()=>{
    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
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

    const reponse = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send(newExpanse);

    expect(reponse.status).toBe(201)
    expect(reponse.body).toHaveProperty("id");
  })
});

describe('GET /despesas findAll expense controller ', ()=>{

  it('Should be  logged in', async()=>{
    const reponse = await request(server).get('/api/v1/despesas').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be return array of expenses', async()=>{

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });


    const response = await request(server).get("/api/v1/despesas").set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    response.body.forEach((element: object) => {
      expect(element).toHaveProperty("id");
    });

    expect(response.body).toBeInstanceOf(Array);
  });

  it('Should be revenue array return max 10 expanses if pagination not exist', async()=>{
    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-04-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-05-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-06-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-07-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-08-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-09-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-10-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-11-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-12-14')
    });

    const response = await request(server).get("/api/v1/despesas").set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });

  it('Should pagination work in expanse array', async()=>{
    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-03-14')
    });

    const response = await request(server).get("/api/v1/despesas?page=1&limit=1").set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
    response.body.forEach((expenses: object) => {
      expect(expenses).toHaveProperty("id");
      expect(expenses).toMatchObject(
        {
          descricao: expect.stringMatching(/venda de produtos/i),
          valor: 1500,
          data: new Date('2024-02-14').toISOString()
        }
      )
    });

    const response2 = await request(server).get("/api/v1/despesas?page=2&limit=1").set('Authorization', `Bearer ${token}`);
    response2.body.forEach((expenses: object) => {
      expect(expenses).toHaveProperty("id");
      expect(expenses).toMatchObject(
        {
          descricao: expect.stringMatching(/venda de produtos/i),
          valor: 1500,
          data: new Date('2024-03-14').toISOString()
        }
      )
    });
  })

  it('Should be return expense if descrition match in query params', async()=>{
    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Salário Ygor",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Salário Larissa",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    const response = await request(server).get("/api/v1/despesas?descricao=Salário").set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    
    response.body.forEach((expanse: { descricao: string; })=>{
      expect(expanse.descricao).toMatch(/salário/i)
    })
  })

 

});

describe('GET /despesas/ano/mes', ()=>{
  it('Should be  logged in', async()=>{
    const reponse = await request(server).get('/api/v1/despesas/2024/12').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  });
  
  it('Should be list of expense for month', async()=>{
    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "compra de itens",
      valor: 1500,
      data: new Date('2024-01-02')
    });

    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "compra de produtos",
      valor: 1500,
      data: new Date('2024-01-02')
    });

    const response = await request(server).get('/api/v1/despesas/2024/01').set('Authorization', `Bearer ${token}`)
    response.body.forEach((expense: {data:string} )=>{
      const expenseData = new Date(expense.data);
      const month = expenseData.getMonth() +1;
      const year = expenseData.getFullYear()
      expect(year).toBe(2024);
      expect(month).toBe(1);
    })
  });

  it('Should be array empty of expense for month', async()=>{

    const response = await request(server).get('/api/v1/despesas/2002/01').set('Authorization', `Bearer ${token}`)
    expect(response.status).toEqual(200)
    expect(response.body).toEqual([])
  });
});

describe('GET /despesas/id findOne revenue controller', ()=>{
  it('Should be  logged in', async()=>{
    const reponse = await request(server).get('/api/v1/despesas/4').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be return expases with details' ,async ()=>{
    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-02-14')
    });

    const response = await request(server).get('/api/v1/despesas/1').set('Authorization', `Bearer ${token}`);

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
    const response = await request(server).get('/api/v1/despesas/6000').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  
    expect(response.body).toEqual({ mensagem: 'Despesa não encontrada.'});
  })
});

describe('PUT /despesas/id update expanse controller', ()=>{
  it('Should be  logged in', async()=>{
    const reponse = await request(server).put('/api/v1/despesas/4').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be update expanse', async()=>{

    const reponsePost = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
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

    const reponse = await request(server).put(`/api/v1/despesas/${idExpanse}`).set('Authorization', `Bearer ${token}`)
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
    await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de produtos",
      valor: 1500,
      data: new Date('2024-07-14')
    });


    const reponsePost = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
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

    const reponse = await request(server).put(`/api/v1/despesas/${idExpanse}`).set('Authorization', `Bearer ${token}`)
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

    const reponse = await request(server).put(`/api/v1/despesas/10000`).set('Authorization', `Bearer ${token}`)
    .send(newInfoExpanse);
    expect(reponse.status).toBe(200);
    expect(reponse.body).toEqual({ mensagem: 'Despesa não encontrada.' });
  });
});

describe('DELETE /despesas/id delete revenue controller', ()=>{
  it('Should be  logged in', async()=>{
    const reponse = await request(server).delete('/api/v1/despesas/4').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be delete expanse', async()=>{
    const responsePost = await request(server).post("/api/v1/despesas").set('Authorization', `Bearer ${token}`)
    .send({
      descricao: "Venda de roupas",
      valor: 1500,
      data: new Date('2024-11-14')
    });

    const idExpanse = responsePost.body.id;
    
    const response = await request(server).delete(`/api/v1/despesas/${idExpanse}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensagem: 'Despesa excluida com sucesso.' });
  });

  it('Should be message if expanse not exist', async()=>{

    const response = await request(server).delete(`/api/v1/despesas/1000000`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensagem: 'Despesa não encontrada.'});
  });

});


//fechando o servidor depois de cada teste
afterAll(()=>{
	server.close();
});