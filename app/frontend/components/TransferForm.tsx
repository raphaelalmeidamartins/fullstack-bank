import { StatusCodes } from 'http-status-codes';
import { ChangeEvent, FormEvent, useState } from 'react';
import service from '../service';
import Modal from './Modal';

export default function TransferForm({
  token,
  updateBalance,
}: {
  token: string;
  updateBalance: Function;
}) {
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('0');
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
        setValue('0');
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
    <section>
      <form action="POST" onSubmit={handleSubmit}>
        <h2>Transferir</h2>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          placeholder="Usuário"
        />
        <input
          type="text"
          name="value"
          value={value}
          onChange={handleChange}
          placeholder="Valor"
        />
        <button type="submit">ENVIAR</button>
      </form>

      <Modal
        display={displayModal}
        message="Transação realizada com sucesso!"
        buttonMessage="OK"
        handleClick={() => setDisplayModal(false)}
      />
      {!!errorMessage && <p>{errorMessage}</p>}
    </section>
  );
}
