import { StatusCodes } from 'http-status-codes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GrUpdate } from 'react-icons/gr';
import { MdLogout } from 'react-icons/md';
import TransactionsList from '../components/TransactionsList';
import TransferForm from '../components/TransferForm';
import service from '../service';
import styles from '../styles/pages/Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [username, setUserName] = useState('');

  const [balance, setBalance] = useState('0,00');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/');
  };

  const handleUpdateBalance = async (authorization: string) => {
    if (token) {
      const response = await service.get.balance(authorization);
      const data = await response.json();

      switch (response.status) {
        case StatusCodes.OK:
          setErrorMessage('');
          setBalance(data.balance.toFixed(2).replace('.', ','));
          break;

        case StatusCodes.UNAUTHORIZED:
          handleLogout();
          break;

        default:
          setErrorMessage(data.message);
          break;
      }
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('userData');

    if (!userData) {
      router.push('/');
    }

    const parsedData = JSON.parse(userData as string);

    setToken(parsedData.token);
    setUserName(parsedData.username);
  }, []);

  useEffect(() => {
    handleUpdateBalance(token);
  }, [token]);

  return (
    <div className={styles.page}>
      <Head>
        <title>DW.CASH - Início</title>
        <meta name="description" content="Projeto fullstack de carteira digital" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>{`Olá @${username}`}</h1>
        <button type="button" title="Sair" onClick={handleLogout}>
          <MdLogout />
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.balance}>
          <div className={styles.balance__label}>
            <h2>Saldo disponível:</h2>
            <button type="button" title="Atualizar" onClick={() => handleUpdateBalance(token)}>
              <GrUpdate />
            </button>
          </div>
          <span className={styles.balance__value}>{`R$ ${balance}`}</span>
          {!!errorMessage && <p>{errorMessage}</p>}
        </section>

        <TransferForm token={token} updateBalance={handleUpdateBalance} />

        <TransactionsList token={token} username={username} balance={balance} />
      </main>
    </div>
  );
}
