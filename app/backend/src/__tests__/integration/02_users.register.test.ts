import { expect, request, use } from 'chai';
import * as sinon from 'sinon';
// Esse módulo precisa ser importado assim
import jwt = require('jsonwebtoken');
// @ts-ignore
import chaiHttp from 'chai-http';

import { StatusCodes } from 'http-status-codes';
import { Transaction as SequelizeTransaction } from 'sequelize/types';
import App from '../../app';
import db from '../../database/models';
import Account from '../../database/models/Account';
import User from '../../database/models/User';
import {
  invalidRegisterRequestBodies,
  invalidRegisterResponseBodies,
  mockAccount,
  mockUser,
  validRegisterRequestBody,
  validRegisterResponseBody,
} from './mocks/usersMocks';

const app = new App();

use(chaiHttp);

describe('POST /users', () => {
  afterEach(() => sinon.restore());

  it('Retorna status CREATED (201) com mensagem indicando que a operação foi bem-sucedida', async () => {
    sinon.stub(User, 'findOne').resolves(null);
    sinon.stub(User, 'create').resolves(mockUser as User);
    sinon.stub(Account, 'create').resolves(mockAccount as unknown as Account);
    sinon.stub(db, 'transaction').resolves({
      async commit() {},
      async rollback() {},
      async afterCommit() {},
    } as unknown as SequelizeTransaction);

    const response = await request(app.app)
      .post('/users')
      .send(validRegisterRequestBody);

    expect(response.status).to.be.eq(StatusCodes.CREATED);
    expect(response.body).to.be.deep.eq(validRegisterResponseBody);
  });

  it('Retorna status INTERNAL SERVER ERROR (500) com mensagem de erro caso haja alguma falha durante a atualização do banco de dados. As aoperações devem ser canceladas.', async () => {
    sinon.stub(User, 'findOne').resolves(null);
    sinon.stub(User, 'create').resolves(mockUser as User);
    sinon.stub(Account, 'create').rejects();
    const sequelizeTransactionStub = sinon.stub(db, 'transaction').resolves({
      async commit() {},
      async rollback() {},
      async afterCommit() {},
    } as unknown as SequelizeTransaction);

    const response = await request(app.app)
      .post('/users')
      .send(validRegisterRequestBody);

    expect(sequelizeTransactionStub.calledOnce).to.be.true;
    expect(response.status).to.be.eq(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[4]);
  });

  it('Retorna status UNPROCESSABLE ENTITY (422) com mensagem de erro caso o nome de usuário não esteja disponível', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);

    const response = await request(app.app)
      .post('/users')
      .send(validRegisterRequestBody);

    expect(response.status).to.be.eq(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[0]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso o nome de usuário tenha menos de 3 caracteres', async () => {
    const response = await request(app.app)
      .post('/users')
      .send(invalidRegisterRequestBodies[0]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[1]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso o corpo da requisição não contenha o nome de usuário', async () => {
    const response = await request(app.app)
      .post('/users')
      .send(invalidRegisterRequestBodies[1]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[2]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso o nome de usuário não seja do tipo string', async () => {
    const response = await request(app.app)
      .post('/users')
      .send(invalidRegisterRequestBodies[2]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[2]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso o nome de usuário seja uma string vazia', async () => {
    const response = await request(app.app)
      .post('/users')
      .send(invalidRegisterRequestBodies[3]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[2]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso a senha tenha menos de 8 caracteres', async () => {
    const response = await request(app.app)
      .post('/users')
      .send(invalidRegisterRequestBodies[4]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[3]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso a senha não tenha pelo menos um caractere numérico', async () => {
    const response = await request(app.app)
      .post('/users')
      .send(invalidRegisterRequestBodies[5]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[3]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso a senha não contenha pelo menos uma letra maiúscula', async () => {
    const response = await request(app.app)
      .post('/users')
      .send(invalidRegisterRequestBodies[5]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[3]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso a senha não seja do tipo string', async () => {
    const response = await request(app.app)
      .post('/users')
      .send(invalidRegisterRequestBodies[6]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[3]);
  });

  it('Retorna status BAD REQUEST (400) com mensagem de erro caso a senha seja uma string vazia', async () => {
    const response = await request(app.app)
      .post('/users')
      .send(invalidRegisterRequestBodies[6]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(invalidRegisterResponseBodies[3]);
  });
});
