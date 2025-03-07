module.exports = {
  devServer: {
    allowedHosts: ['localhost', '127.0.0.1'],
    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
};
