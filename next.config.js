const withLinaria = require('next-linaria')
const WorkerPlugin = require('worker-plugin')

module.exports = withLinaria({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new WorkerPlugin({
          globalObject: 'self',
        }),
      )
    }
    return config
  },
})
