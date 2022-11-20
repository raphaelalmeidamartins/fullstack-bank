import CustomGenericError from './CustomGenericError';

class UnprocessableEntityError extends CustomGenericError {
  constructor(message: string) {
    super(message, 422);
  }
}

export default UnprocessableEntityError;
