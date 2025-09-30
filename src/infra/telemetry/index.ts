import { NodeSDK } from '@opentelemetry/sdk-node'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import cluster from 'cluster'
import FastifyOtelInstrumentation from '@fastify/otel'

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'turbo-recipes-api',
})

const prometheusExporter = new PrometheusExporter({
  port: 9464,
})

const sdk = new NodeSDK({
  resource,
  metricReader: cluster.isPrimary ? prometheusExporter : undefined,
  instrumentations: [
    getNodeAutoInstrumentations(),
    new FastifyOtelInstrumentation({
      servername: 'turbo-recipes-api',
      registerOnInitialization: true,
      ignorePaths: (opts) => {
        return opts.url.startsWith('/metrics')
      },
    }),
  ],
  contextManager: new AsyncLocalStorageContextManager(),
})

sdk.start()

if (cluster.isPrimary) {
  console.log(
    '🚀 OpenTelemetry primary started. Metrics available at http://localhost:9464/metrics',
  )
} else {
  console.log(`🚀 OpenTelemetry worker ${process.pid} started.`)
}

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('OTel SDK shut down successfully.'))
    .catch((error) => console.error('Error shutting down OTel SDK:', error))
    .finally(() => process.exit(0))
})
