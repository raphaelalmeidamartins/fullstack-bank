import { StatusCodes } from 'http-status-codes';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FaLock, FaUserAlt } from 'react-icons/fa';
import logo from '../assets/logo-dwcash.png';
import Footer from '../components/Footer';
import service from '../service';
import styles from '../styles/pages/Home.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleFocus = (name: string) => {
    setFocused(name);
  };

  const getIconModifier = (name: string): string => {
    const modifier = {
      focus: styles['form__icon--focus'],
      blur: styles['form__icon--blur'],
    };

    return focused === name ? modifier.focus : modifier.blur;
  };

  const disableButton = (): boolean => {
    const minUsernameLength = 3;
    const minPasswordLength = 6;
    return (
      username.length < minUsernameLength || password.length < minPasswordLength
    );
  };

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const name = target.name as 'username' | 'password';

    const setState = {
      username: (): void => setUsername(target.value),
      password: (): void => setPassword(target.value),
    };

    setState[name]();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await service.post.login(username, password);
    const data = await response.json();

    switch (response.status) {
      case StatusCodes.OK:
        setErrorMessage('');
        localStorage.setItem('userData', JSON.stringify(data));
        router.push('/dashboard');
        break;

      default:
        setErrorMessage(data.message);
        break;
    }
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>DW.CASH - Login</title>
        <meta
          name="description"
          content="Projeto fullstack de carteira digital"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form className={styles.form} action="POST" onSubmit={handleSubmit}>
          <header>
            <Image className={styles.page__logo} src={logo} alt="NG.CASH" />
            <p>Login</p>
          </header>
          <div className={styles['form__input-container']}>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Nome de usuário"
              onFocus={() => handleFocus('username')}
              onBlur={() => handleFocus('')}
            />
            <span
              className={`${styles.form__icon} ${getIconModifier('username')}`}
            >
              <FaUserAlt />
            </span>
          </div>
          <div className={styles['form__input-container']}>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Senha"
              onFocus={() => handleFocus('password')}
              onBlur={() => handleFocus('')}
            />
            <span
              className={`${styles.form__icon} ${getIconModifier('password')}`}
            >
              <FaLock />
            </span>
          </div>
          {!!errorMessage && (
            <p className={styles['form__error-message']}>{errorMessage}</p>
          )}
          <button
            className={styles.form__button}
            type="submit"
            disabled={disableButton()}
          >
            ENVIAR
          </button>
          <button
            type="button"
            className={styles.form__button}
            onClick={() => router.push('/register')}
          >
            CRIAR CONTA
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
