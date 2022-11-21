import { mockUser, mockUser2 } from './usersMocks';

export const validRegisterTransactionResponseBody = {
  message: 'Transação efetuada com sucesso',
};

export const validRegisterTransactionRequestBody = {
  username: mockUser2.username,
  value: 2,
};

export const invalidRegisterTransactionRequestBodies = [
  {
    username: mockUser2.username,
    value: 20000,
  },
  {
    username: mockUser.username,
    value: 2,
  },
  {
    value: 2,
  },
  {
    username: mockUser2.username,
  },
  {
    username: '',
    value: 2,
  },
  {
    username: 123,
    value: 2,
  },
  {
    username: mockUser2.username,
    value: 'abc',
  },
  {
    username: mockUser2.username,
    value: -20,
  },
  {
    username: mockUser2.username,
    value: 0,
  },
];

export const invalidRegisterTransactionResponseBodies = [
  {
    message: 'Você não tem saldo suficiente para realizar esta transação.',
  },
  {
    message: 'Não é possível fazer uma transação para a mesma conta.',
  },
  {
    message:
      'Dados de transação inválidos, verifique se o nome de usuário está correto.',
  },
  {
    message: 'Todos os campos precisam ser preenchidos.',
  },
  {
    message: 'O valor da transação precisa ser um valor numérico positivo',
  },
  { message: 'Erro interno do servidor.' },
];

export const transactionListMock = [
  {
    id: 5,
    value: 2,
    createdAt: '2022-11-21T00:07:23.326Z',
    debitedAccount: {
      id: 1,
      user: {
        id: 1,
        username: 'raphaelmartins',
      },
    },
    creditedAccount: {
      id: 4,
      user: {
        id: 4,
        username: 'daniloputinato',
      },
    },
  },
  {
    id: 4,
    value: 5,
    createdAt: '2022-11-19T00:07:11.180Z',
    debitedAccount: {
      id: 1,
      user: {
        id: 1,
        username: 'raphaelmartins',
      },
    },
    creditedAccount: {
      id: 2,
      user: {
        id: 2,
        username: 'xuxameneguel',
      },
    },
  },
  {
    id: 3,
    value: 20,
    createdAt: '2022-10-30T00:06:30.547Z',
    debitedAccount: {
      id: 2,
      user: {
        id: 2,
        username: 'xuxameneguel',
      },
    },
    creditedAccount: {
      id: 1,
      user: {
        id: 1,
        username: 'raphaelmartins',
      },
    },
  },
  {
    id: 2,
    value: 10,
    createdAt: '2022-09-21T00:06:15.678Z',
    debitedAccount: {
      id: 4,
      user: {
        id: 4,
        username: 'daniloputinato',
      },
    },
    creditedAccount: {
      id: 1,
      user: {
        id: 1,
        username: 'raphaelmartins',
      },
    },
  },
  {
    id: 1,
    value: 10,
    createdAt: '2022-08-12T00:05:53.476Z',
    debitedAccount: {
      id: 3,
      user: {
        id: 3,
        username: 'katyperry',
      },
    },
    creditedAccount: {
      id: 1,
      user: {
        id: 1,
        username: 'raphaelmartins',
      },
    },
  },
];

export const invalidTransactionsListResponseBody = {
  message: 'Token não encontrado.',
};
