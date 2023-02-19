import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { firebaseAuth } from './firebase.app';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void) {
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer ', '');

    await firebaseAuth.verifyIdToken(token).catch((err) => {
      throw new HttpException(
        { message: 'Input data validation failed', err },
        HttpStatus.UNAUTHORIZED,
      );
    });
    next();
  }
}
