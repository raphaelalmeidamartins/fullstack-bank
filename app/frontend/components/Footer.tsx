import styles from '../styles/components/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      Full stack project desenvolvido por
      {' '}
      <a href="https://github.com/raphaelalmeidamartins">Raphael Martins</a>
      {' '}
      com Next.js e Node.js
    </footer>
  );
}
