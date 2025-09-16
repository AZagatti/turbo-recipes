import { FastifyInstance } from 'fastify'
import postgres from 'postgres'

export const setupGracefulShutdown = (
  app: FastifyInstance,
  dbConnection: postgres.Sql,
) => {
  const signals = ['SIGINT', 'SIGTERM']

  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(`[${signal}] Received. Shutting down gracefully...`)

      try {
        await app.close()
        app.log.info('✅ HTTP server closed successfully.')

        await dbConnection.end()
        app.log.info('✅ Database connection closed successfully.')

        process.exit(0)
      } catch (err) {
        app.log.error('Error during graceful shutdown:', err)
        process.exit(1)
      }
    })
  }
}
