import { Request } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { CustomHttpError } from '../erros/custom.http.error';
export class UserUtils  {

  getIdUserFromToken(req: Request): number {
    const secretKey = process.env.SECRET;

    if (!secretKey) {
      throw new CustomHttpError('A secret deve ser fornecida ');
    }

    const token = req.get('authorization')?.split(' ')[1];

    if (!token) {
      throw new CustomHttpError('Token não existe');
    }

    const decodedToken = jsonwebtoken.verify(token, secretKey) as { id: number };

    const id = decodedToken.id;

    return id;
  }
}