import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = './dist';
const srcFolder = './src';

export const path = {
    build: {
        js:`${buildFolder}/js/`,
        css:`${buildFolder}/css/`,
        html:`${buildFolder}/`,
        images:`${buildFolder}/img/`,
        fonts: `${buildFolder}/fonts/`,
        files: `${buildFolder}/files/`,
        json: `${buildFolder}/js/json/`
    },
    src: {
        js: `${srcFolder}/js/app.js`,
        json: `${srcFolder}/js/json/**/*.*`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        svg: `${srcFolder}/img/**/*.svg `,
        scss: `${srcFolder}/scss/style.scss`,
        html:`${srcFolder}/*.html`,
        files: `${srcFolder}/files/**/*.*`,
        
    },
    watch: {
        js: `${srcFolder}/js/**/*.js`,
        json: `${srcFolder}/js/json/**/*.*`,
        scss: `${srcFolder}/scss/**/*.scss`,
        html: `${srcFolder}/**/*.html`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg,gif,webp}`,
        files: `${srcFolder}/files/**/*.*`
    }, 
    clean: buildFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
    ftp: ``
};