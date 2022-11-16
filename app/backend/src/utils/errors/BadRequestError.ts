import CustomGenericError from './CustomGenericError';

class BadRequestError extends CustomGenericError {
  constructor(message: string) {
    super(message, 400, 'BadRequestError');
  }
}

export default BadRequestError;
