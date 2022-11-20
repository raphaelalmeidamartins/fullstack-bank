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
  invalidBalanceResponseBodies,
  invalidLoginRequestBodies,
  invalidLoginResponseBodies,
  invalidRegisterRequestBodies,
  invalidRegisterResponseBodies,
  mockAccount,
  mockToken,
  mockUser,
  validBalanceResponseBody,
  validLoginRequestBody,
  validLoginResponseBody,
  validRegisterRequestBody,
  validRegisterResponseBody
} from './mocks/usersMocks';

const app = new App();

use(chaiHttp);

describe('Verifica as rotas /users', () => {
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

  describe('POST /users', () => {
    afterEach(() => sinon.restore());

    it('Retorna status CREATED (201) com mensagem indicando que a operação foi bem-sucedida', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves(mockUser as User);
      sinon.stub(Account, 'create').resolves(mockAccount as unknown as Account);

      const response = await request(app.app)
        .post('/users')
        .send(validRegisterRequestBody);

      expect(response.status).to.be.eq(StatusCodes.CREATED);
      expect(response.body).to.be.deep.eq(validRegisterResponseBody);
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

  describe('GET /users/balance', () => {
    afterEach(() => sinon.restore());

    it('Retorna status OK (200) com objeto contendo o saldo do usuário caso a operação seja bem-sucedida', async () => {
      sinon.stub(User, 'findOne').resolves(mockUser as User);
      sinon
        .stub(Account, 'findOne')
        .resolves(mockAccount as unknown as Account);

      const {
        body: { token },
      } = await request(app.app)
        .post('/users/login')
        .send(validLoginRequestBody);

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
      sinon
        .stub(Account, 'findOne')
        .resolves(mockAccount as unknown as Account);

      const {
        body: { token },
      } = await request(app.app)
        .post('/users/login')
        .send(validLoginRequestBody);

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
      } = await request(app.app)
        .post('/users/login')
        .send(validLoginRequestBody);

      const response = await request(app.app)
        .get('/users/balance')
        .set('authorization', token);

      expect(response.status).to.be.eq(StatusCodes.NOT_FOUND);
      expect(response.body).to.be.deep.eq(invalidBalanceResponseBodies[2]);
    });
  });
});
