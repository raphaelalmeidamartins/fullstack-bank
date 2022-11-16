import CustomGenericError from './CustomGenericError';

class NotFoundError extends CustomGenericError {
  constructor(message: string) {
    super(message, 404, 'NotFoundError');
  }
}

export default NotFoundError;
