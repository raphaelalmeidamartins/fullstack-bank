import * as bcrypt from 'bcryptjs';

export const mockToken = 'any-toen';

export const validLoginRequestBody = {
  username: 'xuxameneguel',
  password: 'Bank_secret_123',
};

export const validRegisterRequestBody = validLoginRequestBody;

export const invalidLoginRequestBodies = [
  {
    username: 'angelica',
    password: 'Bank_secret_123',
  },
  {
    username: 'xuxameneguel',
    password: 'Bank_secret_',
  },
  {
    password: 'Bank_secret_123',
  },
  {
    username: 'xuxameneguel',
  },
  {
    username: 123,
    password: 'Bank_secret_123',
  },
  {
    username: 'xuxameneguel',
    password: 123,
  },
  {
    username: 'xuxameneguel',
    password: 'Bank_secret_123',
    Wow: 'wow',
  },
  {
    username: 'xuxameneguel',
    password: '',
  },
  {
    username: '',
    password: 'Bank_secret_123',
  },
];

export const invalidRegisterRequestBodies = [
  {
    username: 'xu',
    password: 'Bank_secret_123',
  },
  {
    password: 'Bank_secret_123',
  },
  {
    username: 123,
    password: 'Bank_secret_123',
  },
  {
    username: '',
    password: 'Bank_secret_123',
  },
  {
    username: 'xuxameneguel',
    password: 'Ba123',
  },
  {
    username: 'xuxameneguel',
    password: 'Bank_secret',
  },
  {
    username: 'xuxameneguel',
    password: 'bank_secret_123',
  },
  {
    username: 'xuxameneguel',
    password: 123,
  },
  {
    username: 'xuxameneguel',
    password: '',
  },
];

export const mockUser = {
  id: 1,
  username: validLoginRequestBody.username,
  password: bcrypt.hashSync(validLoginRequestBody.password, 10),
  accountId: 1,
};

export const mockAccount = {
  id: 1,
  balance: 100.0,
};

export const validBalanceResponseBody = {
  balance: mockAccount.balance,
};

export const validLoginResponseBody = {
  id: mockUser.id,
  username: mockUser.username,
  token: mockToken,
};

export const validRegisterResponseBody = {
  message: 'Usuário registrado com sucesso.',
};

export const invalidLoginResponseBodies = [
  {
    message: 'O nome de usuário ou a senha estão incorretos',
  },
  {
    message: 'Todos os campos precisam ser preenchidos.',
  },
  {
    message: 'O corpo da requisição contém campos que não são permitidos.',
  },
];

export const invalidRegisterResponseBodies = [
  {
    message: 'O nome de usuário escolhido está indisponível, escolha outro',
  },
  {
    message: 'O nome de usuário precisa ter no mínimo 3 caracteres.',
  },
  {
    message: 'Todos os campos precisam ser preenchidos.',
  },
  {
    message:
      'A senha precisa ter pelo menos 8 caracteres, um número e uma letra maiúscula.',
  },
];

export const invalidBalanceResponseBodies = [
  {
    message: 'Token não encontrado.',
  },
  {
    message: 'Token inválido ou expirado.',
  },
  {
    message: 'Não foi possível encontrar o usuário ou a conta.',
  },
];
