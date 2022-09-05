import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const server = (done) => {
    
    app.plugins.browsersync.init({
        server: {
            baseDir: `${app.path.build.html}`,
            directory: true,
            middleware: express().use(
      '/init/',
      createProxyMiddleware({ target: 'http://localhost:8011', changeOrigin: true })
    )
        },
        notify: false,
        cors: true,
        port: 3000,

    });

   
};

