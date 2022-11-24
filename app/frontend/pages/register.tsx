import { StatusCodes } from 'http-status-codes';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FaLock, FaUserAlt } from 'react-icons/fa';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import service from '../service';
import styles from '../styles/pages/Register.module.css';
import logo from '../assets/logo-dwcash.png';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayModal, setDisplayModal] = useState(false);

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
      username: (): void => {
        setUsername(target.value);
      },
      password: (): void => setPassword(target.value),
    };

    setState[name]();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await service.post.users(username, password);
    const data = await response.json();

    switch (response.status) {
      case StatusCodes.CREATED:
        setUsername('');
        setPassword('');
        setFocused('');
        setErrorMessage('');
        setDisplayModal(true);
        break;

      default:
        setErrorMessage(data.message);
        break;
    }
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>DW.CASH - Cadastro</title>
        <meta name="description" content="Projeto fullstack de carteira digital" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <form className={styles.form} action="POST" onSubmit={handleSubmit}>
          <header>
            <Image className={styles.page__logo} src={logo} alt="NG.CASH" />
            <p>Criar conta</p>
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
        </form>

        <Modal
          display={displayModal}
          message="Usuário criado com sucesso!"
          buttonMessage="ENTRAR"
          handleClick={() => router.push('/')}
        />
      </main>

      <Footer />
    </div>
  );
}
