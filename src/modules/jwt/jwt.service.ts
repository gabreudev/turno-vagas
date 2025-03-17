import jwt from 'jsonwebtoken';

export class JwtService {
  sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: jwt.Secret | jwt.PrivateKey,
    options: jwt.SignOptions = {},
  ): string {
    return jwt.sign(payload, secretOrPrivateKey, options);
  }

  verify(
    token: string,
    secretOrPublicKey: jwt.Secret | jwt.PublicKey,
    options: jwt.VerifyOptions & { complete?: boolean } = {},
  ): jwt.JwtPayload | null {
    try {
      const decoded = jwt.verify(token, secretOrPublicKey, options);

      if (options.complete) {
        return decoded as jwt.Jwt;
      }

      return decoded as jwt.JwtPayload;
    } catch (error) {
      // TODO: Implement proper logging including the user who got the error
      console.error(`JWT Verification Error: ${error}`);
      return null;
    }
  }
}
