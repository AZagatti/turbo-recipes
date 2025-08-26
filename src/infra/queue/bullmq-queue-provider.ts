import {
  Job,
  JobPayloads,
  QueueProvider,
} from '@/core/contracts/queue-provider'
import { injectable } from 'tsyringe'
import { mailQueue } from './mail-queue'

@injectable()
export class BullmqQueueProvider implements QueueProvider {
  async add<T extends keyof JobPayloads>(job: Job<T>): Promise<void> {
    await mailQueue.add(job.name, job.payload)
  }
}
