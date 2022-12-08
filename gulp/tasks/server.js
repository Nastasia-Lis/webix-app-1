import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import  historyApiFallback  from 'connect-history-api-fallback';
export const server = (done) => {
    
    app.plugins.browsersync.init({
        server: {
            baseDir: `${app.path.build.html}`,
            directory: true,
            middleware: [express().use(
                '/init/',
                createProxyMiddleware({ target: 'http://localhost:8011', changeOrigin: true })
            ),historyApiFallback()]
        },
        notify: false,
        cors: true,
        port: 3000,

    });

   
};

