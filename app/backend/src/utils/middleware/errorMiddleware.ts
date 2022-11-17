import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomGenericError from '../errors/CustomGenericError';
import { JsonWebTokenError } from 'jsonwebtoken';

function errorMiddleware(
  err: JsonWebTokenError | CustomGenericError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof JsonWebTokenError) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token inválido ou expirado.' });
  } else if (err instanceof CustomGenericError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Erro interno do servidor.' });
  }
}

export default errorMiddleware;
