/* eslint-disable no-restricted-syntax */

const LINARIA_EXTENSION = '.linaria.module.css'

function traverse(rules) {
  for (const rule of rules) {
    if (typeof rule.loader === 'string' && rule.loader.includes('css-loader')) {
      if (
        rule.options &&
        rule.options.modules &&
        typeof rule.options.modules.getLocalIdent === 'function'
      ) {
        const nextGetLocalIdent = rule.options.modules.getLocalIdent
        rule.options.modules.getLocalIdent = (
          context,
          _,
          exportName,
          options,
        ) => {
          if (context.resourcePath.includes(LINARIA_EXTENSION)) {
            return exportName
          }
          return nextGetLocalIdent(context, _, exportName, options)
        }
      }
    }
    if (typeof rule.use === 'object') {
      traverse(Array.isArray(rule.use) ? rule.use : [rule.use])
    }
    if (Array.isArray(rule.oneOf)) {
      traverse(rule.oneOf)
    }
  }
}

module.exports = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    traverse(config.module.rules)
    config.module.rules.push({
      test: /\.(tsx|ts|js|mjs|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('@linaria/webpack5-loader'),
          options: {
            sourceMap: process.env.NODE_ENV !== 'production',
            ...(nextConfig.linaria || {}),
            extension: LINARIA_EXTENSION,
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }
    return config
  },
  future: {
    webpack5: true,
  },
})
