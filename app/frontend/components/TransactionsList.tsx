import { StatusCodes } from 'http-status-codes';
import {
  ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import { BsCash } from 'react-icons/bs';
import service from '../service';
import styles from '../styles/components/TransactionsList.module.css';
import ITransaction from '../types/ITransaction';

export default function TransactionsList({
  token,
  username,
  balance,
}: {
  token: string;
  username: string;
  balance: string;
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

    if (token) {
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
    }
  };

  useEffect(() => {
    handleUpdateList();
  }, [token, balance]);

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
    <section className={styles.section}>
      <h2 className={styles.section__title}>Histórico</h2>
      {!!errorMessage && (
        <p className={styles['form__error-message']}>{errorMessage}</p>
      )}
      {!errorMessage && (
        <>
          <form
            className={styles.form}
            action="GET"
            onSubmit={handleUpdateList}
          >
            <label className={styles['form__input-label']} htmlFor="type">
              <span>Tipo:</span>
              <div className={styles['form__input-container']}>
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
              </div>
            </label>
            <section className={styles['form__date-filters']}>
              <label className={styles['form__input-label']} htmlFor="from">
                <span>De:</span>
                <div className={styles['form__input-container']}>
                  <input
                    type="date"
                    name="from"
                    id="from"
                    value={from}
                    onChange={handleChange}
                  />
                </div>
              </label>
              <label className={styles['form__input-label']} htmlFor="to">
                <span>até:</span>
                <div className={styles['form__input-container']}>
                  <input
                    type="date"
                    name="to"
                    id="to"
                    value={to}
                    onChange={handleChange}
                  />
                </div>
              </label>
            </section>
            <button className={styles.form__button} type="submit">
              APLICAR
            </button>
          </form>
          <ul className={styles.list}>
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
                  <div className={styles.list__item}>
                    <span className={styles.list__icon}>
                      <BsCash />
                    </span>
                    <div className={styles.list__info}>
                      <strong>
                        Transação
                        {' '}
                        {debitedUSer === username ? 'enviada' : 'recebida'}
                      </strong>
                      <div>
                        <p>
                          @
                          {debitedUSer === username ? creditedUser : debitedUSer}
                        </p>
                        <p>
                          R$
                          {' '}
                          {value.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
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
