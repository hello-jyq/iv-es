
module.exports = {
  devServer: {
    port: 9527,
    disableHostCheck: true,
    proxy: {

      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        ws: true
      },
      '/sc': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        ws: true
      }
    }
  },
  // publicPath: '/cone/',
  publicPath: process.env.VUE_APP_CONTEXT_PATH,
  productionSourceMap: false,
  lintOnSave: false
}
