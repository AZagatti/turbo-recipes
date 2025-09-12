export interface CacheProvider {
  set(key: string, value: string, ttlInSeconds: number): Promise<void>
  get(key: string): Promise<string | null>
  invalidate(key: string): Promise<void>
}
