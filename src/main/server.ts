import cluster from 'cluster'
import { cpus } from 'os'
import { app } from './app'
import { setupGracefulShutdown } from './shutdown'
import { env } from '@/config'
import { connection } from '@/infra/db'

const numCPUs = cpus().length

if (cluster.isPrimary && env.ENABLE_CLUSTER) {
  console.log(`Primary ${process.pid} is running`)

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking another one...`)
    cluster.fork()
  })

  const shutdownPrimary = () => {
    console.log('Shutting down primary process...')
    for (const id in cluster.workers) {
      cluster.workers[id]?.process.kill()
    }
    process.exit(0)
  }

  process.on('SIGINT', shutdownPrimary)
  process.on('SIGTERM', shutdownPrimary)
} else {
  app
    .listen({
      host: env.HOST,
      port: env.PORT,
    })
    .then(() => {
      app.log.info(
        `🚀 Worker ${process.pid} started and listening on http://${env.HOST}:${env.PORT}`,
      )
    })

  setupGracefulShutdown(app, connection)
}
if (env.RUN_WORKER_IN_API) {
  import('./worker.js')
}
