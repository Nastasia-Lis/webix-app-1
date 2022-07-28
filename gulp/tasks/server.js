import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import url from 'url';


export const server = (done) => {
    
    // var proxyOptions = url.parse('http://192.168.85.201:3000');
    // proxyOptions.route = '/api';

    

    // express().use(
    //   '/init/default/api/fields',
    //   createProxyMiddleware({ target: 'http://localhost:8011', changeOrigin: true })
    // );

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
        //files: `../../dist/index.html`, 
        // ui: {
        //     port: 8011,
        //     weinre: {
        //         port: 9090
        //     }
        // }
    });

   
};

