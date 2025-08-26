import { Queue } from 'bullmq'
import { env } from '@/config'
import { SendMailParams } from '@/core/contracts/mail-provider'

export type MailJobPayload = SendMailParams

const { hostname: host, port } = new URL(env.REDIS_URL)
const connection = { host, port: Number(port) }

export const mailQueue = new Queue<MailJobPayload>('mail', { connection })
