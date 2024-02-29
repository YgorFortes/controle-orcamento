/**
 * @jest-environment ../../../prisma/prisma-enviroment-jest
*/

import app from '../../src/server'
import request from 'supertest'; 
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

let server: any;
// let token : string
//abrindo o servidor depois de cada teste
beforeEach(async ()=>{
  const port = 6000
  server = app.server.listen(port)
});

describe('POST /cadastrar create user controller', ()=>{
  it('Should be create a new user with token valid',  async()=>{
    const reponse = await request(server).post('/api/v1/cadastrar').send({
      nome: "login da silva",
      login: "login",
      email: "naruto@gmail.com",
      senha: "123",
      confirmarSenha: "123"
    });


    expect(reponse.body.token).not.toBeNull();
    const secret = process.env.SECRET;
    if(secret){
      const tokenValid = jsonwebtoken.verify(reponse.body.token, secret);
      expect(tokenValid).toBeTruthy();
    }
    expect(reponse.body.mensagem).toBe('Usuário cadastrado com sucesso')

  });

  it('Should be return a message with status code 401 if login or email already exist', async()=>{
    await request(server).post('/api/v1/cadastrar').send({
      nome: "login da silva",
      login: "login",
      email: "naruto@gmail.com",
      senha: "123",
      confirmarSenha: "123"
    });

    const reponse = await request(server).post('/api/v1/cadastrar').send({
      nome: "login da silva",
      login: "login",
      email: "naruto@gmail.com",
      senha: "123",
      confirmarSenha: "123"
    });

    expect(reponse.body.mensagem).toBe('O usuário já está cadastrado. Utilize um login ou e-mail diferente para criar uma nova conta.');
    expect(reponse.status).toBe(409);
  });

  it('Should be return a message if a body is passed incorrectly', async()=>{
    const reponse = await request(server).post('/api/v1/cadastrar').send({
      login: "login",
      email: "naruto@gmail.com",
      senha: "123",
      confirmarSenha: "123"
    });

    expect(reponse.body.mensagem).toBe('O campo nome é obrigatório.');
    expect(reponse.status).toBe(400);
  });

  it('Shoud be field senha and confirmarSenha same value, and confirmarSenha obrigatório', async ()=>{
    const reponse1 = await request(server).post('/api/v1/cadastrar').send({
      nome: "login da silva",
      login: "login",
      email: "naruto@gmail.com",
      senha: "123",
    });

    expect(reponse1.body.mensagem).toBe('O campo confirmarSenha é obrigatório.');
    expect(reponse1.status).toBe(400);

    const reponse2 = await request(server).post('/api/v1/cadastrar').send({
      nome: "login da silva",
      login: "login",
      email: "naruto@gmail.com",
      senha: "123",
      confirmarSenha: "1234"
    });

    expect(reponse2.body.mensagem).toBe('As senhas devem corresponder');
    expect(reponse2.status).toBe(400);
  })
});

describe('POST /login login user controller', ()=>{
  it('Should be login if body passed correctly with login or email and password', async()=>{

    await request(server).post('/api/v1/cadastrar').send({
      nome: "login da silva",
      login: "login",
      email: "naruto@gmail.com",
      senha: "123",
      confirmarSenha: "123"
    });

    const expectLogin = {
      login: "login",
      senha: "123",
    }

    const expectLoginWithEmail = {
      email: "naruto@gmail.com",
      senha: "123",
    }
   
    const reponse = await request(server).post('/api/v1/login').send(expectLogin);
    const reponse2 = await request(server).post('/api/v1/login').send(expectLoginWithEmail);

    expect(reponse.body.login).toBe(expectLogin.login);
    expect(reponse.body.nome).toBe('login da silva');
    expect(reponse.status).toBe(200)
    expect(reponse.body.token).not.toBeNull();
    const secret = process.env.SECRET;
    if(secret){
      const tokenValid = jsonwebtoken.verify(reponse.body.token, secret);
      expect(tokenValid).toBeTruthy();
    }

    expect(reponse2.body.login).toBe(expectLogin.login);
    expect(reponse2.status).toBe(200)
  })

  it('Should be send in body email or login and senha is required', async()=>{
    
    const expectLogin1 = {
      senha: "123",
    }

    const reponse1 = await request(server).post('/api/v1/login').send(expectLogin1);

    expect(reponse1.status).toBe(400)
    expect(reponse1.body.mensagem).toBe('Deve fornecer email ou login.')

    const expectLogin2 = {
      login: "login",
    }

    const reponse2 = await request(server).post('/api/v1/login').send(expectLogin2);
    expect(reponse2.status).toBe(400)
    expect(reponse2.body.mensagem).toBe('O campo senha é obrigatório.')
  })

  it('Should be pass password  correctly', async()=>{
    await request(server).post('/api/v1/cadastrar').send({
      nome: "ygola da silva",
      login: "ygola",
      email: "ygola@gmail.com",
      senha: "123",
      confirmarSenha: "123"
    });


    const reponse = await request(server).post('/api/v1/login').send({
      login: "ygola",
      senha: "124",
    });

    expect(reponse.body.mensagem).toBe('Não autorizado')
    expect(reponse.status).toBe(401);
  });

  it('Should be user exist in database', async()=>{
    const reponse = await request(server).post('/api/v1/login').send({
      login: "ronaldo",
      senha: "123",
    });

    expect(reponse.body.mensagem).toBe('Credenciais inválidas')
    expect(reponse.status).toBe(401);
  });

  
})

//fechando o servidor depois de cada teste
afterEach(()=>{
	server.close();
});