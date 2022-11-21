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
import Transaction from '../../database/models/Transactions';
import User from '../../database/models/User';
import {
  invalidRegisterTransactionRequestBodies,
  invalidRegisterTransactionResponseBodies,
  validRegisterTransactionRequestBody,
  validRegisterTransactionResponseBody
} from './mocks/transactionsMocks';
import {
  mockAccount,
  mockAccount2,
  mockUser,
  mockUser2,
  validLoginRequestBody,
} from './mocks/usersMocks';

const app = new App();

use(chaiHttp);

describe('POST /transactions', () => {
  afterEach(() => sinon.restore());

  it('Retorna status CREATED (201) com uma mensagem indicando que a operação foi bem-sucedida', async () => {
    sinon
      .stub(User, 'findOne')
      .onFirstCall()
      .resolves(mockUser as User)
      .onSecondCall()
      .resolves(mockUser2 as User);
    sinon.stub(User, 'findByPk').resolves(mockUser as User);
    sinon
      .stub(Account, 'findByPk')
      .onFirstCall()
      .resolves(mockAccount as unknown as Account)
      .onSecondCall()
      .resolves(mockAccount2 as unknown as Account);
    sinon.stub(db, 'transaction').resolves({
      async commit() {},
      async rollback() {},
      async afterCommit() {},
    } as unknown as SequelizeTransaction);
    sinon.stub(Transaction, 'create').resolves();

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(validRegisterTransactionRequestBody);

    expect(response.status).to.be.eq(StatusCodes.CREATED);
    expect(response.body).to.be.deep.eq(validRegisterTransactionResponseBody);
  });

  it('Retorna status INTERNAL SERVER ERRO (500) caso haja erro durante atualização do banco de dados. As atualizações devem ser canceladas', async () => {
    sinon
      .stub(User, 'findOne')
      .onFirstCall()
      .resolves(mockUser as User)
      .onSecondCall()
      .resolves(mockUser2 as User);
    sinon.stub(User, 'findByPk').resolves(mockUser as User);
    sinon
      .stub(Account, 'findByPk')
      .onFirstCall()
      .resolves(mockAccount as unknown as Account)
      .onSecondCall()
      .resolves({
        ...mockAccount2,
        async update() {
          throw new Error();
        },
      } as unknown as Account);
    const sequelizeTransactionStub = sinon.stub(db, 'transaction').resolves({
      async commit() {},
      async rollback() {},
      async afterCommit() {},
    } as unknown as SequelizeTransaction);
    sinon.stub(Transaction, 'create').resolves();

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(validRegisterTransactionRequestBody);

    expect(sequelizeTransactionStub.calledOnce).to.be.true;
    expect(response.status).to.be.eq(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[5]
    );
  });

  it('Retorna status UNPROCESSABLE ENTITY (422) com uma mensagem de erro caso o usuário não tenha saldo suficiente para realizar a transação', async () => {
    sinon
      .stub(User, 'findOne')
      .onFirstCall()
      .resolves(mockUser as User)
      .onSecondCall()
      .resolves(mockUser2 as User);
    sinon.stub(User, 'findByPk').resolves(mockUser as User);
    sinon
      .stub(Account, 'findByPk')
      .onFirstCall()
      .resolves(mockAccount as unknown as Account)
      .onSecondCall()
      .resolves(mockAccount2 as unknown as Account);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(invalidRegisterTransactionRequestBodies[0]);

    expect(response.status).to.be.eq(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[0]
    );
  });

  it('Retorna status UNPROCESSABLE ENTITY (422) com uma mensagem de erro caso a pessoa esteja tentando fazer uma transação para a própria conta', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon.stub(User, 'findByPk').resolves(mockUser as User);
    sinon.stub(Account, 'findByPk').resolves(mockAccount as unknown as Account);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(invalidRegisterTransactionRequestBodies[1]);

    expect(response.status).to.be.eq(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[1]
    );
  });

  it('Retorna status NOT FOUND (404) com uma mensagem de erro caso o usuário do token não seja encontrado no banco de dados', async () => {
    sinon
      .stub(User, 'findOne')
      .onFirstCall()
      .resolves(mockUser as User)
      .onSecondCall()
      .resolves(mockUser2 as User);
    sinon.stub(User, 'findByPk').resolves(null);
    sinon
      .stub(Account, 'findByPk')
      .onFirstCall()
      .resolves(null)
      .onSecondCall()
      .resolves(mockAccount2 as unknown as Account);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(invalidRegisterTransactionRequestBodies[0]);

    expect(response.status).to.be.eq(StatusCodes.NOT_FOUND);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[2]
    );
  });

  it('Retorna status NOT FOUND (404) com uma mensagem de erro caso o nome de usuário fornecido no corpo da requisição não seja encontrado no banco de dados', async () => {
    sinon
      .stub(User, 'findOne')
      .onFirstCall()
      .resolves(mockUser as User)
      .onSecondCall()
      .resolves(null);
    sinon.stub(User, 'findByPk').resolves(mockUser as User);
    sinon
      .stub(Account, 'findByPk')
      .onFirstCall()
      .resolves(mockAccount as unknown as Account)
      .onSecondCall()
      .resolves(null);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(validRegisterTransactionRequestBody);

    expect(response.status).to.be.eq(StatusCodes.NOT_FOUND);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[2]
    );
  });

  it('Retorna status BAD REQUEST (400) com uma mensagem de erro caso o nome de usuário esteja faltando no corpo da requisição', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(invalidRegisterTransactionRequestBodies[2]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[3]
    );
  });

  it('Retorna status BAD REQUEST (400) com uma mensagem de erro caso o valor da transação esteja faltando no corpo da requisição', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(invalidRegisterTransactionRequestBodies[3]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[3]
    );
  });

  it('Retorna status BAD REQUEST (400) com uma mensagem de erro caso o nome de usuário seja uma string vazia', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(invalidRegisterTransactionRequestBodies[4]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[3]
    );
  });

  it('Retorna status BAD REQUEST (400) com uma mensagem de erro caso o nome de usuário não seja do tipo string', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(invalidRegisterTransactionRequestBodies[5]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[3]
    );
  });

  it('Retorna status BAD REQUEST (400) com uma mensagem de erro caso o valor da transação não seja um número', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(invalidRegisterTransactionRequestBodies[5]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[3]
    );
  });

  it('Retorna status BAD REQUEST (400) com uma mensagem de erro caso o valor da transação seja um número negativo', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(invalidRegisterTransactionRequestBodies[6]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[4]
    );
  });

  it('Retorna status BAD REQUEST (400) com uma mensagem de erro caso o valor da transação seja zero', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .post('/transactions')
      .set('authorization', token)
      .send(invalidRegisterTransactionRequestBodies[6]);

    expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(response.body).to.be.deep.eq(
      invalidRegisterTransactionResponseBodies[4]
    );
  });
});
