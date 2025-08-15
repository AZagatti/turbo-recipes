import { HashComparer } from '@/core/contracts/hash-comparer'
import { Hasher } from '@/core/contracts/hasher'

export class FakeHasher implements Hasher, HashComparer {
  async hash(plain: string): Promise<string> {
    return `${plain}-hashed`
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return `${plain}-hashed` === hash
  }
}
