import 'reflect-metadata'
import './container'

import { Worker } from 'bullmq'
import { container } from 'tsyringe'
import { mailQueue, MailJobPayload } from '@/infra/queue/mail-queue'
import { MailProvider } from '@/core/contracts/mail-provider'

const worker = new Worker<MailJobPayload>(
  'mail',
  async (job) => {
    console.log(`[Worker] Processing job: ${job.name}`)

    const mailProvider = container.resolve<MailProvider>('MailProvider')

    await mailProvider.sendMail(job.data)

    console.log(`[Worker] Job ${job.name} completed.`)
  },
  {
    connection: mailQueue.opts.connection,
  },
)

console.log('[Worker] Mail worker started and listening for jobs...')

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error: ${err.message}`)
})
