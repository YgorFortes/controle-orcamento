/**
 * @jest-environment ../../../prisma/prisma-enviroment-jest
*/

import app from '../../src/server'
import request from 'supertest'; 
import jsonwebtooken from 'jsonwebtoken'


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

describe('PATCH /usuario/atualizar update authUser controller' , ()=>{
  it('Should be  logged in', async()=>{
    const reponse = await request(server).patch('/api/v1/usuario/atualizar').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should be uppdate user if fields body is correctly ', async()=>{
    const expectPatch= {
      nome: 'camila'
  }

    const reponse = await request(server).patch('/api/v1/usuario/atualizar').set('Authorization', `Bearer ${token}`)
    .send(expectPatch)

    expect(reponse.status).toBe(200)
    expect(reponse.body.mensagem).toBe('Usuário atualizado com sucesso.');

    const loginReponse =  await request(server).post('/api/v1/login').send({
      login: "login",
      senha: "123",
      confirmarSenha: "123"
    })

    expect(loginReponse.status).toBe(200)
    expect(loginReponse.body.token).not.toBeNull();
    const secret = process.env.SECRET;
    if(secret){
      const tokenValid = jsonwebtooken.verify(loginReponse.body.token, secret);
      expect(tokenValid).toBeTruthy();
    }

    expect(loginReponse.body.nome).toBe(expectPatch.nome)
  });

  it('Should be  in body if senha  passed confirmarSenha should be passed and verify they are the same ', async()=>{
    const expectPatch1 = {
      senha:  "123"
    }

    const responde1 = await request(server).patch('/api/v1/usuario/atualizar').set('Authorization', `Bearer ${token}`)
    .send(expectPatch1)

    expect(responde1.status).toBe(400)
    expect(responde1.body.mensagem).toBe('O campo confirmarSenha é obrigatório')

    const expectPatch2 = {
      senha:  "123",
      confirmarSenha: "456"
    }

    const responde2 = await request(server).patch('/api/v1/usuario/atualizar').set('Authorization', `Bearer ${token}`)
    .send(expectPatch2)

    expect(responde2.status).toBe(400)
    expect(responde2.body.mensagem).toBe('As senhas devem corresponder')
  
  })


  it('Should be return a message if login or email already exist in database', async()=>{

    await request(server).post('/api/v1/cadastrar').send({
      nome: "Cristiana",
      login: "cristiana.ana",
      email: "cristiana@gmail.com",
      senha: "123",
      confirmarSenha: "123"
    });

    const expectPatch = {
      login:  "cristiana.ana",
    }

    const reponse = await request(server).patch('/api/v1/usuario/atualizar').set('Authorization', `Bearer ${token}`)
    .send(expectPatch)

    expect(reponse.body.mensagem).toBe('O usuário já está cadastrado. Utilize um login ou e-mail diferente para criar uma nova conta.');
    expect(reponse.status).toBe(409);
  
  })


  it('Should be change password', async()=>{
 
    const reponsePatch = await request(server).patch('/api/v1/usuario/atualizar').set('Authorization', `Bearer ${token}`).send({
      senha:  "852",
      confirmarSenha: "852"
    });

    expect(reponsePatch.status).toBe(200)
    expect(reponsePatch.body.mensagem).toBe('Usuário atualizado com sucesso.');
  })

});


describe('DELETE /usuario/excluir', ()=>{

  it('Should be  logged in', async()=>{
    const reponse = await request(server).delete('/api/v1/usuario/excluir').set('Authorization', `Bearer ${'token'}`)
    expect(reponse.body.mensagem).toBe('Token inválido')
    expect(reponse.status).toBe(401)
  })

  it('Should confirm if senha e confirmarSenha are placed and if equals', async()=>{
    
    const expectDelete = {
      senha:  "852",
    }

    const reponse = await request(server).delete('/api/v1/usuario/excluir').set('Authorization', `Bearer ${token}`)
    .send(expectDelete)

    expect(reponse.status).toBe(400)
    expect(reponse.body.mensagem).toBe('O campo confirmarSenha é obrigatório.')


    const expectDelete2 = {
      senha:  "123",
      confirmarSenha: "535"
    }

    const reponse2 = await request(server).delete('/api/v1/usuario/excluir').set('Authorization', `Bearer ${token}`)
    .send(expectDelete2)


    expect(reponse2.status).toBe(400)
    expect(reponse2.body.mensagem).toBe('As senhas devem corresponder')
  });

  it('Should be password user correct for delete user', async()=>{
    const expectDelete= {
      senha:  "123",
      confirmarSenha: "123"
    }

    const reponse2 = await request(server).delete('/api/v1/usuario/excluir').set('Authorization', `Bearer ${token}`)
    .send(expectDelete)
    expect(reponse2.status).toBe(401)
    expect(reponse2.body.mensagem).toBe('Não autorizado')
  });

  it('Should be delete user', async()=>{
    const expectDelete= {
      senha:  "852",
      confirmarSenha: "852"
    }

    const reponse2 = await request(server).delete('/api/v1/usuario/excluir').set('Authorization', `Bearer ${token}`)
    .send(expectDelete)

    expect(reponse2.status).toBe(200)
    expect(reponse2.body.mensagem).toBe('Usuário deletado com sucesso.')

    const reponseLogin = await request(server).post('/api/v1/login').send({
      login: "login",
      senha: "123",
      confirmarSenha: "123"
    });
    
    expect(reponseLogin.status).toBe(401)
    expect(reponseLogin.body.mensagem).toBe('Credenciais inválidas')
  });

});

describe('Logout /usuario/logout', ()=>{
  it('Should be logout user and token invalid', async()=>{
    const reponse = await request(server).get('/api/v1/usuario/logout').set('Authorization', `Bearer ${token}`);
    expect(reponse.body.mensagem).toBe('Usuário deslogado com sucesso')
    expect(reponse.status).toBe(200);

    const respondeRevenue = await request(server).get('/api/v1/receitas/').set('Authorization', `Bearer ${token}`);
    expect(respondeRevenue.body.mensagem).toBe('Token inválido')
    expect(respondeRevenue.status).toBe(401)


    const responseExpanse = await request(server).get('/api/v1/despesas/').set('Authorization', `Bearer ${token}`);
    expect(responseExpanse.body.mensagem).toBe('Token inválido')
    expect(responseExpanse.status).toBe(401)


    const responseSummary= await request(server).get('/api/v1/resumo/2020/12').set('Authorization', `Bearer ${token}`);
    expect(responseSummary.body.mensagem).toBe('Token inválido')
    expect(responseSummary.status).toBe(401)
  });
});

//fechando o servidor depois de cada teste
afterAll(()=>{
	server.close();
});