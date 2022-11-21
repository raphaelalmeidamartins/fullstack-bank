import { expect, request, use } from 'chai';
import * as sinon from 'sinon';
// Esse módulo precisa ser importado assim
import jwt = require('jsonwebtoken');
// @ts-ignore
import chaiHttp from 'chai-http';

import { StatusCodes } from 'http-status-codes';
import App from '../../app';
import Transaction from '../../database/models/Transactions';
import User from '../../database/models/User';
import { transactionListMock } from './mocks/transactionsMocks';
import { mockUser, validLoginRequestBody } from './mocks/usersMocks';

const app = new App();

use(chaiHttp);

describe('GET /transactions', () => {
  afterEach(() => sinon.restore());

  it('Retorna status OK (200) com a lista de todas transações do usuário de acordo com o token fornecido', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon
      .stub(Transaction, 'findAll')
      .resolves(transactionListMock as unknown as Transaction[]);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/transactions')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.OK);
    expect(response.body).to.be.deep.eq(transactionListMock);
  });

  it('Retorna status OK (200) com a lista de todas transações enviadas do usuário de acordo com o token fornecido', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon
      .stub(Transaction, 'findAll')
      .resolves(transactionListMock as unknown as Transaction[]);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/transactions')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.OK);
    expect(response.body).to.be.deep.eq(transactionListMock);
  });

  it('Retorna status OK (200) com a lista de todas transações recebidas do usuário de acordo com o token fornecido', async () => {
    const filteredByCashin = transactionListMock.filter(
      ({ creditedAccount: { id } }) => id == mockUser.accountId
    );

    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon
      .stub(Transaction, 'findAll')
      .resolves(filteredByCashin as unknown as Transaction[]);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/transactions?type=cashin')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.OK);
    expect(response.body).to.be.deep.eq(filteredByCashin);
  });

  it('Retorna status OK (200) com a lista de todas transações efetuadas do usuário de acordo com o token fornecido', async () => {
    const filteredByCashout = transactionListMock.filter(
      ({ debitedAccount: { id } }) => id == mockUser.accountId
    );

    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon
      .stub(Transaction, 'findAll')
      .resolves(filteredByCashout as unknown as Transaction[]);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/transactions?type=cashout')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.OK);
    expect(response.body).to.be.deep.eq(filteredByCashout);
  });

  it('Retorna status OK (200) com a lista de todas transações do usuário a partir da data fornecida de acordo com o token fornecido', async () => {
    const filteredByDate = transactionListMock.filter(({ createdAt }) => {
      return new Date(createdAt) >= new Date('11/01/2022');
    });

    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon
      .stub(Transaction, 'findAll')
      .resolves(filteredByDate as unknown as Transaction[]);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/transactions?from=11/01/2022')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.OK);
    expect(response.body).to.be.deep.eq(filteredByDate);
  });

  it('Retorna status OK (200) com a lista de todas transações do usuário demtro do intervalo fornecido de acordo com o token fornecido', async () => {
    const filteredByDate = transactionListMock.filter(({ createdAt }) => {
      const date = new Date(createdAt);
      const from = new Date('09/01/2022');
      const to = new Date('11/01/2022');
      return date >= from && date <= to;
    });

    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon
      .stub(Transaction, 'findAll')
      .resolves(filteredByDate as unknown as Transaction[]);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/transactions?from=09/01/2022&to=11/01/2022')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.OK);
    expect(response.body).to.be.deep.eq(filteredByDate);
  });

  it('Retorna status OK (200) com a lista de todas transações do usuário utilizando todos os filtros de acordo com o token fornecido', async () => {
    const filteredByDate = transactionListMock.filter(
      ({ creditedAccount: { id }, createdAt }) => {
        const date = new Date(createdAt);
        const from = new Date('09/01/2022');
        const to = new Date('11/01/2022');
        return date >= from && date <= to && id === mockUser.accountId;
      }
    );

    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon
      .stub(Transaction, 'findAll')
      .resolves(filteredByDate as unknown as Transaction[]);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/transactions?type=cashin&from=09/01/2022&to=11/01/2022')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.OK);
    expect(response.body).to.be.deep.eq(filteredByDate);
  });

  it('Retorna status OK (200) com a lista de todas transações do usuário utilizando todos os filtros de acordo com o token fornecido', async () => {
    const filteredByDate = transactionListMock.filter(
      ({ debitedAccount: { id }, createdAt }) => {
        const date = new Date(createdAt);
        101;
        const from = new Date('09/01/2022');
        const to = new Date('11/01/2022');
        return date >= from && date <= to && id === mockUser.accountId;
      }
    );

    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon
      .stub(Transaction, 'findAll')
      .resolves(filteredByDate as unknown as Transaction[]);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/transactions?type=cashin&from=09/01/2022&to=11/01/2022')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.OK);
    expect(response.body).to.be.deep.eq(filteredByDate);
  });

  it('Retorna status UNAUTHORIZED (401) caso o token não esteja nos headers da requisição.', async () => {
    const response = await request(app.app).get('/transactions');

    expect(response.status).to.be.eq(StatusCodes.UNAUTHORIZED);
    // expect(response.body).to.be.deep.eq(filteredByDate);
  });
});
