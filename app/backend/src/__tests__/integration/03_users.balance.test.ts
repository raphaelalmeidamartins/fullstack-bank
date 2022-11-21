import { expect, request, use } from 'chai';
import * as sinon from 'sinon';
// Esse módulo precisa ser importado assim
import jwt = require('jsonwebtoken');
// @ts-ignore
import chaiHttp from 'chai-http';

import { StatusCodes } from 'http-status-codes';
import App from '../../app';
import Account from '../../database/models/Account';
import User from '../../database/models/User';
import {
  invalidBalanceResponseBodies, mockAccount,
  mockToken,
  mockUser,
  validBalanceResponseBody,
  validLoginRequestBody,
} from './mocks/usersMocks';

const app = new App();

use(chaiHttp);

describe('GET /users/balance', () => {
  afterEach(() => sinon.restore());

  it('Retorna status OK (200) com objeto contendo o saldo do usuário caso a operação seja bem-sucedida', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon.stub(Account, 'findOne').resolves(mockAccount as unknown as Account);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/users/balance')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.OK);
    expect(response.body).to.be.deep.eq(validBalanceResponseBody);
  });

  it('Retorna status UNAUTHORIZED (401) com mensagem de erro caso o token não esteja nos headers da requisição', async () => {
    const response = await request(app.app).get('/users/balance');

    expect(response.status).to.be.eq(StatusCodes.UNAUTHORIZED);
    expect(response.body).to.be.deep.eq(invalidBalanceResponseBodies[0]);
  });

  it('Retorna status UNAUTHORIZED (401) com mensagem de erro caso o token não seja válido ou tenha expirado', async () => {
    const response = await request(app.app)
      .get('/users/balance')
      .set('authorization', mockToken);

    expect(response.status).to.be.eq(StatusCodes.UNAUTHORIZED);
    expect(response.body).to.be.deep.eq(invalidBalanceResponseBodies[1]);
  });

  it('Retorna status NOT FOUND (404) com mensagem de erro caso o usuário dono do token não seja encontrado no banco de dados', async () => {
    sinon
      .stub(User, 'findOne')
      .onFirstCall()
      .resolves(mockUser as User)
      .onSecondCall()
      .resolves(null);
    sinon.stub(Account, 'findOne').resolves(mockAccount as unknown as Account);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/users/balance')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.NOT_FOUND);
    expect(response.body).to.be.deep.eq(invalidBalanceResponseBodies[2]);
  });

  it('Retorna status NOT FOUND (404) com mensagem de erro caso a conta do usuário dono do token não seja encontrada no banco de dados', async () => {
    sinon.stub(User, 'findOne').resolves(mockUser as User);
    sinon.stub(Account, 'findOne').resolves(null);

    const {
      body: { token },
    } = await request(app.app).post('/users/login').send(validLoginRequestBody);

    const response = await request(app.app)
      .get('/users/balance')
      .set('authorization', token);

    expect(response.status).to.be.eq(StatusCodes.NOT_FOUND);
    expect(response.body).to.be.deep.eq(invalidBalanceResponseBodies[2]);
  });
});
