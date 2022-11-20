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
