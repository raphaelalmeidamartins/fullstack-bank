import { StatusCodes } from 'http-status-codes';
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import { BsCash } from 'react-icons/bs';
import service from '../service';
import ITransaction from '../types/ITransaction';

export default function TransactionsList({
  token,
  username,
}: {
  token: string;
  username: string;
}) {
  const [type, setType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [transactions, setTransactions] = useState([] as ITransaction[]);

  const handleUpdateList = async (event?: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    const response = await service.get.transactions(token, type, from, to);
    const data = await response.json();

    switch (response.status) {
      case StatusCodes.OK:
        setErrorMessage('');
        setTransactions(data);
        break;

      case StatusCodes.UNAUTHORIZED:
        setErrorMessage('Seu login expirou');
        break;

      default:
        setErrorMessage(data.message);
        break;
    }
  };

  useEffect(() => {
    handleUpdateList();
  }, [token]);

  const handleChange = ({
    target,
  }: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const name = target.name as 'type' | 'from' | 'to';

    const setState = {
      type: (): void => setType(target.value),
      from: (): void => setFrom(target.value),
      to: (): void => setTo(target.value),
    };

    setState[name]();
  };

  return (
    <section>
      <h2>Histórico</h2>
      {!!errorMessage && <p>{errorMessage}</p>}
      {!errorMessage && (
        <>
          <form action="GET" onSubmit={handleUpdateList}>
            <label htmlFor="type">
              Tipo:
              <select
                name="type"
                value={type}
                id="type"
                onChange={handleChange}
              >
                <option value="">Todas</option>
                <option value="cashout">Enviadas</option>
                <option value="cashin">Recebidas</option>
              </select>
            </label>
            <section>
              <h3>Filtrar por período:</h3>
              <label htmlFor="from">
                De:
                <input
                  type="date"
                  name="from"
                  id="from"
                  value={from}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="to">
                a:
                <input
                  type="date"
                  name="to"
                  id="to"
                  value={to}
                  onChange={handleChange}
                />
              </label>
            </section>
            <button type="submit">APLICAR</button>
          </form>
          <ul>
            {transactions.map(
              ({
                id,
                debitedAccount: {
                  user: { username: debitedUSer },
                },
                creditedAccount: {
                  user: { username: creditedUser },
                },
                value,
                createdAt,
              }) => (
                <li key={id}>
                  <span>
                    <BsCash />
                  </span>
                  <div>
                    <span>
                      Transação
                      {' '}
                      {debitedUSer === username ? 'enviada' : 'recebida'}
                    </span>
                    <span>
                      @
                      {debitedUSer === username ? creditedUser : debitedUSer}
                    </span>
                    <span>
                      R$
                      {' '}
                      {value.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <span>{new Date(createdAt).toLocaleDateString()}</span>
                </li>
              ),
            )}
          </ul>
        </>
      )}
    </section>
  );
}
