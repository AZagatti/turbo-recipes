import { Hasher } from '@/core/contracts/hasher'
import { HashComparer } from '@/core/contracts/hash-comparer'
import { compare, hash } from 'bcryptjs'

export class BcryptHasher implements Hasher, HashComparer {
  private HASH_SALT_LENGTH = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
