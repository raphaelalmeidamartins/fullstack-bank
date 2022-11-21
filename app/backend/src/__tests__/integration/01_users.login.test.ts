import { expect, request, use } from 'chai';
import * as sinon from 'sinon';
// Esse módulo precisa ser importado assim
import jwt = require('jsonwebtoken');
// @ts-ignore
import chaiHttp from 'chai-http';

import { StatusCodes } from 'http-status-codes';
import App from '../../app';
import User from '../../database/models/User';
import {
  invalidLoginRequestBodies,
  invalidLoginResponseBodies,
  mockToken,
  mockUser,
  validLoginRequestBody,
  validLoginResponseBody,
} from './mocks/usersMocks';

const app = new App();

use(chaiHttp);

describe('POST /users/login', () => {
  afterEach(() => sinon.restore());

  it('Retorna status OK (200) com objeto com dados do usuário e token se as credenciais forem válidas', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon.stub(jwt, 'sign').resolves(mockToken);

    const response = await request(app.app)
      .post('/users/login')
      .send(validLoginRequestBody);

    expect(response.status).to.be.eq(StatusCodes.OK);
    expect(response.body).to.be.deep.eq(validLoginResponseBody);
  });

  it('Retorna status UNAUTHORIZED (401) com mensagem de erro caso o nome de usuário esteja incorreto', async () => {
    sinon.stub(User, 'findOne').resolves(null);

    const response = await request(app.app)
      .post('/users/login')
      .send(invalidLoginRequestBodies[0]);

    expect(response.status).to.be.eq(StatusCodes.UNAUTHORIZED);
    expect(response.body).to.be.deep.eq(invalidLoginResponseBodies[0]);
  });

  it('Retorna status UNAUTHORIZED (401) com mensagem de erro caso a senha esteja incorreta', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);

    const response = await request(app.app)
      .post('/users/login')
      .send(invalidLoginRequestBodies[1]);

    expect(response.status).to.be.eq(StatusCodes.UNAUTHORIZED);
    expect(response.body).to.be.deep.eq(invalidLoginResponseBodies[0]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso o nome de usuário não esteja no corpo da requisição', async () => {
    const response = await request(app.app)
      .post('/users/login')
      .send(invalidLoginRequestBodies[2]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidLoginResponseBodies[1]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso a senha não esteja no corpo da requisição', async () => {
    const response = await request(app.app)
      .post('/users/login')
      .send(invalidLoginRequestBodies[3]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidLoginResponseBodies[1]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso o nome de usuário não seja do tipo string', async () => {
    const response = await request(app.app)
      .post('/users/login')
      .send(invalidLoginRequestBodies[4]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidLoginResponseBodies[1]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso a senha não seja do tipo string', async () => {
    const response = await request(app.app)
      .post('/users/login')
      .send(invalidLoginRequestBodies[5]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidLoginResponseBodies[1]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso o corpo da requisição tenha campos a mais', async () => {
    const response = await request(app.app)
      .post('/users/login')
      .send(invalidLoginRequestBodies[6]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidLoginResponseBodies[2]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso a senha seja uma string vazia', async () => {
    const response = await request(app.app)
      .post('/users/login')
      .send(invalidLoginRequestBodies[7]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidLoginResponseBodies[1]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso o nome de usuário seja uma string vazia', async () => {
    const response = await request(app.app)
      .post('/users/login')
      .send(invalidLoginRequestBodies[8]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidLoginResponseBodies[1]);
  });
});
