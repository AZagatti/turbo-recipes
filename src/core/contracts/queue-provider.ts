import { SendMailParams } from './mail-provider'

export type JobPayloads = {
  'send-forgot-password-mail': SendMailParams
}

export interface Job<T extends keyof JobPayloads> {
  name: T
  payload: JobPayloads[T]
}

export interface QueueProvider {
  add<T extends keyof JobPayloads>(job: Job<T>): Promise<void>
}
