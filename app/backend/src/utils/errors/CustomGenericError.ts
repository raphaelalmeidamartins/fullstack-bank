class CustomGenericError extends Error {
  private _details = [{ type: 'custom' }];

  constructor(message: string, private _statusCode: number, private _name: string) {
    super(message);
  }

  get name() { return this._name; }
  get statusCode() { return this._statusCode; }
  get details() { return this._details; }
}

export default CustomGenericError;
