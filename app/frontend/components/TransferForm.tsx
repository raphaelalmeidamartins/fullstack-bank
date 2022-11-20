import { StatusCodes } from 'http-status-codes';
import { ChangeEvent, FormEvent, useState } from 'react';
import service from '../service';
import styles from '../styles/components/TransferForm.module.css';
import Modal from './Modal';

export default function TransferForm({
  token,
  updateBalance,
}: {
  token: string;
  updateBalance: Function;
}) {
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayModal, setDisplayModal] = useState(false);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const name = target.name as 'username' | 'value';

    const setState = {
      username: (): void => setUsername(target.value.replace(' ', '')),
      value: (): void => {
        const valueRegexp = /^\d*([,]{0,1}\d{0,2})$/;
        if (valueRegexp.test(target.value)) {
          setValue(target.value);
        }
      },
    };

    setState[name]();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await service.post.transactions(
      token,
      username,
      +value.replace(',', '.'),
    );
    const data = await response.json();

    switch (response.status) {
      case StatusCodes.CREATED:
        setUsername('');
        setValue('');
        setErrorMessage('');
        updateBalance(token);
        setDisplayModal(true);
        break;

      default:
        setErrorMessage(data.message);
        break;
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.section__title}>Transferir</h2>
      <form className={styles.form} action="POST" onSubmit={handleSubmit}>
        <div className={styles['form__input-container']}>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            placeholder="Usuário"
          />
        </div>
        <div className={styles['form__input-container']}>
          <input
            type="text"
            name="value"
            value={value}
            onChange={handleChange}
            placeholder="Valor"
          />
        </div>
        <button className={styles.form__button} type="submit">
          ENVIAR
        </button>
      </form>
      {!!errorMessage && (
        <p className={styles['form__error-message']}>{errorMessage}</p>
      )}

      <Modal
        display={displayModal}
        message="Transação realizada com sucesso!"
        buttonMessage="OK"
        handleClick={() => setDisplayModal(false)}
      />
    </section>
  );
}
