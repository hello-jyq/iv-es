
module.exports = {
  devServer: {
    port: 9527,
    disableHostCheck: true,
    proxy: {

      '/api': {
        target: 'http://127.0.0.1:8081',
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
