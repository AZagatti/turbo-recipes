import { NodeSDK } from '@opentelemetry/sdk-node'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import cluster from 'cluster'

const prometheusExporter = new PrometheusExporter({
  port: 9464,
})

const sdk = new NodeSDK({
  metricReader: cluster.isPrimary ? prometheusExporter : undefined,
  instrumentations: [getNodeAutoInstrumentations()],
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
