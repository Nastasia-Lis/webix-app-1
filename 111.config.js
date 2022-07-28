// const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // плагин для минимизации JavaScript

// module.exports = { // node js module
// 	devServer: { // настройка для localhost сервера, на котором поднимается фронт при разработке
// 		port: 3000,
// 		proxy: {
// 			"/init/default/login": {
// 				target: "http://127.0.0.1:8011"
// 			},
// 			"/init/default/logout": {
// 				target: "http://127.0.0.1:8011"
// 			},
// 			"/init/default/api": {
// 				target: "http://127.0.0.1:8011"
// 			},
// 			"/init/default/audio_rest": {
// 				target: "http://127.0.0.1:8011"
// 			},
// 			"/init/default/audiobuf": {
// 				target: "http://127.0.0.1:8011"
// 			},
// 			"/init/default/report_stat": {
// 				target: "http://127.0.0.1:8011"
// 			},
// 			"/init/default/report_hosts": {
// 				target: "http://127.0.0.1:8011"
// 			},
// 			"/init/default/report_records": {
// 				target: "http://127.0.0.1:8011"
// 			},
// 		}
// 	},
	// publicPath: process.env.NODE_ENV === 'production'
	// 	? '/init/static/'
	// 	: '/',
	// css: {
	// 	extract: {
	// 		filename: 'css/[name].css',
	// 		chunkFilename: 'css/[name].css',
	// 	},
	// },
	// configureWebpack: {
	// 	optimization: {
	// 		minimizer: [
	// 			// мы указываем здесь пользовательский плагин UglifyJsPlugin, чтобы получить исходные карты в продакшен
	// 			new UglifyJsPlugin({
	// 				cache: true,
	// 				parallel: true,
	// 				uglifyOptions: {
	// 					compress: false,
	// 					ecma: 6,
	// 					mangle: true
	// 				},
	// 				sourceMap: true
	// 			})
	// 		]
	// 	},
	// 	output: {
	// 		filename: 'js/[name].js',
	// 		chunkFilename: 'js/[name].js',
	// 	},
	// },
};
