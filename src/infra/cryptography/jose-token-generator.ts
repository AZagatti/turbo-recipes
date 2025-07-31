import { TokenGenerator } from '@/core/contracts/token-generator'
import { env } from '@/config'
import { SignJWT } from 'jose'

export class JoseTokenGenerator implements TokenGenerator {
  async generate(payload: { sub: string }): Promise<string> {
    const secret = new TextEncoder().encode(env.JWT_SECRET)

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret)

    return token
  }
}
