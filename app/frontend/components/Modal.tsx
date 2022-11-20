import styles from '../styles/components/Modal.module.css';

export default function Modal({
  display,
  message,
  buttonMessage,
  handleClick,
}: {
  display: boolean;
  message: string;
  buttonMessage: string;
  handleClick: Function;
}) {
  return (
    <div className={`${styles.container} ${
      display ? styles['modal--display'] : styles['modal--hidden']
    }`}
    >
      <div
        className={`${styles.modal__overlay} ${
          display ? styles['modal--display'] : styles['modal--hidden']
        }`}
      />
      <div
        className={`${styles.modal} ${
          display ? styles['modal--display'] : styles['modal--hidden']
        }`}
      >
        <p>{message}</p>
        <button
          className={styles.modal__button}
          type="button"
          onClick={() => handleClick()}
        >
          {buttonMessage}
        </button>
      </div>
    </div>
  );
}
