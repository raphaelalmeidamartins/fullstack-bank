import express from 'express';
import swaggerUI from 'swagger-ui-express';
import transactionsRouter from './routes/transactions';
import usersRouter from './routes/users';
import swaggerSettingsBr from './swagger-br.json';
import errorMiddleware from './utils/middleware/errorMiddleware';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    this.app.get('/', (req, res) => res.json({ ok: true }));
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,DELETE,OPTIONS,PUT,PATCH'
      );
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);

    this.app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSettingsBr));

    this.app.use('/users', usersRouter);
    this.app.use('/transactions', transactionsRouter);

    this.app.use(errorMiddleware);
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export default App;
