import { CacheProvider } from '@/core/contracts/cache-provider'

export class FakeCacheProvider implements CacheProvider {
  private cache: Map<string, string> = new Map()

  async set(key: string, value: string): Promise<void> {
    this.cache.set(key, value)
  }

  async get(key: string): Promise<string | null> {
    return this.cache.get(key) || null
  }

  async invalidate(key: string): Promise<void> {
    this.cache.delete(key)
  }
}
