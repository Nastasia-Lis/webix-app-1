import gulp from "gulp";
import {path} from "./gulp/config/path.js";  // пути
import {plugins} from "./gulp/config/plugins.js";  // общие плагины



// передача значений в глобальную переменную
global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: process.argv.includes('--build'),
    path: path,
    gulp: gulp,
    plugins: plugins
};

// импорт задач
import {copy} from "./gulp/tasks/copy.js";
import {reset} from "./gulp/tasks/reset.js";
import {html} from "./gulp/tasks/html.js";
import {server} from "./gulp/tasks/server.js";
import {scss} from "./gulp/tasks/scss.js";
import {js} from "./gulp/tasks/js.js";
import {images} from "./gulp/tasks/images.js";
import {codebase} from "./gulp/tasks/codebase.js";
import {init} from "./gulp/tasks/init.js";
import {fonts} from "./gulp/tasks/fonts.js";
import {cssWebix} from "./gulp/tasks/webix_css.js";
import {jsWebix} from "./gulp/tasks/webix_js.js";

// наблюдает за изменениями
function watcher () {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.codebase, codebase);
    gulp.watch(path.watch.images, images);
    gulp.watch(path.watch.init, init);
    gulp.watch(path.watch.fonts, fonts);
}

const mainTasks = gulp.parallel(copy, html, scss, js, images);

const dev = gulp.series(reset,codebase, mainTasks, gulp.parallel(watcher, server));

const build = gulp.series(reset, fonts, cssWebix, jsWebix, mainTasks);

export {dev};
export {build};

gulp.task('default', dev);

