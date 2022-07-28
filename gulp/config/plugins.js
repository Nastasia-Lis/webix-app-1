import replace from "gulp-replace"; // поиск и замена
import plumber from "gulp-plumber"; // обработка ошибок
import notify from "gulp-notify";  // подсказки 
import browsersync from "browser-sync";
import newer from "gulp-newer"; // проверка обнов
import ifPlugin from "gulp-if";
import proxyMiddleware from "http-proxy-middleware";

export const plugins = {
    replace: replace,
    plumber: plumber,
    notify : notify,
    browsersync: browsersync,
    newer: newer,
    if: ifPlugin,
    proxyMiddleware: proxyMiddleware,
};