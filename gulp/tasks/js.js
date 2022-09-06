import webpack from "webpack-stream";
//import { HtmlWebpackPlugin  } from 'html-webpack-plugin';
import HtmlWebpackPlugin from  "html-webpack-plugin";
//const HtmlWebpackPlugin = require('html-webpack-plugin');

export const js = () => {
    return app.gulp.src(app.path.src.js, {sourcemaps: app.isDev})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "JS",
                message: "Error: <%= error.message %>"
            })
        ))  
        .pipe(webpack({
            mode: app.isBuild ? 'production' : 'development',
            output: {
                filename: 'expaw.js'
             //  filename: '[name].bundle.js',
            },

            // entry: {
            //     index: './src/js/app.js',
            //     another: './src/js/treeItems/tableTemplate.js',
            // },

            // optimization:  {
            //     splitChunks: {
            //       chunks: "all",
            //     },
            // },

            // plugins: [
            //     new HtmlWebpackPlugin({
            //         title: 'Output Management',
            //         //filename: '../index.html',
            //        // template:  'dist/js/index.html',
            //        template: 'src/index.html',
            //       //publicPath: '/'

            //       configCSS: {
            //         publicPath: 'js/codebase/webix.css'
            //       },
            //     }),
            // ],

            
        }))
        .pipe(app.gulp.dest(app.path.build.js))
        
        .pipe(app.plugins.browsersync.stream());
};