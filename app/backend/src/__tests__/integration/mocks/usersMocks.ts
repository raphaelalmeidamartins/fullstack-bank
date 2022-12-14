import * as bcrypt from 'bcryptjs';

export const mockToken = 'any-toen';

export const validLoginRequestBody = {
  username: 'xuxameneguel',
  password: 'Bank_secret_123',
};

export const validLoginRequestBody2 = {
  username: 'angelica',
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

export const mockAccount = {
  id: 1,
  balance: 100.0,
  async update(updateObj: { balance: number }) {
    this.balance = updateObj.balance;
  },
};

export const mockUser = {
  id: 1,
  username: validLoginRequestBody.username,
  password: bcrypt.hashSync(validLoginRequestBody.password, 10),
  accountId: mockAccount.id,
};

export const mockAccount2 = {
  id: 2,
  balance: 100.0,
  async update(updateObj: { balance: number }) {
    this.balance = updateObj.balance;
  },
};

export const mockUser2 = {
  id: 2,
  username: validLoginRequestBody2.username,
  password: bcrypt.hashSync(validLoginRequestBody2.password, 10),
  accountId: mockAccount2.id,
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
  message: 'Usu??rio registrado com sucesso.',
};

export const invalidLoginResponseBodies = [
  {
    message: 'O nome de usu??rio ou a senha est??o incorretos',
  },
  {
    message: 'Todos os campos precisam ser preenchidos.',
  },
  {
    message: 'O corpo da requisi????o cont??m campos que n??o s??o permitidos.',
  },
];

export const invalidRegisterResponseBodies = [
  {
    message: 'O nome de usu??rio escolhido est?? indispon??vel, escolha outro',
  },
  {
    message: 'O nome de usu??rio precisa ter no m??nimo 3 caracteres.',
  },
  {
    message: 'Todos os campos precisam ser preenchidos.',
  },
  {
    message:
      'A senha precisa ter pelo menos 8 caracteres, um n??mero e uma letra mai??scula.',
  },
  { message: 'Erro interno do servidor.' },
];

export const invalidBalanceResponseBodies = [
  {
    message: 'Token n??o encontrado.',
  },
  {
    message: 'Token inv??lido ou expirado.',
  },
  {
    message: 'N??o foi poss??vel encontrar o usu??rio ou a conta.',
  },
];
