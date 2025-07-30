export interface Hasher {
  hash(plain: string): Promise<string>
}
