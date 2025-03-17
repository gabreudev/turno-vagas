import { compare, genSalt, hash } from 'bcryptjs';

const SALT_ROUNDS = 8;

export class HashService {
  async hash(str: string): Promise<string> {
    const salt = await genSalt(SALT_ROUNDS);

    return hash(str, salt);
  }

  async compare(str: string, hash: string): Promise<boolean> {
    return compare(str, hash);
  }
}
