import {
  Job,
  JobPayloads,
  QueueProvider,
} from '@/core/contracts/queue-provider'

export class FakeQueueProvider implements QueueProvider {
  public jobs: Job<keyof JobPayloads>[] = []

  async add<T extends keyof JobPayloads>(job: Job<T>): Promise<void> {
    this.jobs.push(job)
  }
}
