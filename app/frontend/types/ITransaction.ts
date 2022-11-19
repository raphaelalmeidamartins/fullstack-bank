interface ITransaction {
  id: number;
  value: number;
  createdAt: string;
  debitedAccount: {
    id: number;
    user: {
      id: number;
      username: string;
    };
  };
  creditedAccount: {
    id: number;
    user: {
      id: number;
      username: string;
    };
  };
}

export default ITransaction;
