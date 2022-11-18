import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TransactionService from '../services/TransactionService';

class TransactionController {
  private _service: TransactionService;

  constructor() {
    this._service = new TransactionService();

    this.register = this.register.bind(this);
    this.list = this.list.bind(this);
  }

  async register(req: Request, res: Response): Promise<void> {
    await this._service.register(req.headers.authorization, req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Transação efetuada com sucesso' });
  }

  async list(req: Request, res: Response): Promise<void> {
    const { type, from, to } = req.query;

    const transactions = await this._service.list(
      req.headers.authorization,
      type as string | undefined,
      from as string | undefined,
      to as string | undefined
    );

    res.status(StatusCodes.OK).json(transactions);
  }
}

export default TransactionController;
