class CustomGenericError extends Error {
  constructor(message: string, private _statusCode: number) {
    super(message);
  }

  get statusCode() { return this._statusCode; }
}

export default CustomGenericError;
