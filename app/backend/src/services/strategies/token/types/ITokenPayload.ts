import { JwtPayload } from 'jsonwebtoken';

interface ITokenPayload extends JwtPayload {
  id: number;
  username: string;
}

export default ITokenPayload;
