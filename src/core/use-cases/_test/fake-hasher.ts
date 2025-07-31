import { Hasher } from '@/core/repositories/hasher'

export class FakeHasher implements Hasher {
  async hash(plain: string): Promise<string> {
    return `${plain}-hashed`
  }
}
