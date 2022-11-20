import CustomGenericError from './CustomGenericError';

class UnauthorizedError extends CustomGenericError {
  constructor(message: string) {
    super(message, 401);
  }
}

export default UnauthorizedError;
