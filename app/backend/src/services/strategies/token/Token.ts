import * as jwt from 'jsonwebtoken';
import UnauthorizedError from '../../../utils/errors/UnauthorizedError';
import ITokenPayload from './types/ITokenPayload';

class Token {
  static async generate(payload: ITokenPayload): Promise<string> {
    const token = jwt.sign(payload, String(process.env.JWT_SECRET), {
      expiresIn: '24h',
    });
    return token;
  }

  static async validate(
    authorization: string | undefined
  ): Promise<ITokenPayload> {
    if (!authorization) throw new UnauthorizedError('Token não encontrado.');
    const token = authorization;
    const payload = jwt.verify(token, String(process.env.JWT_SECRET));
    return payload as ITokenPayload;
  }
}

export default Token;
