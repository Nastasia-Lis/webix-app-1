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
        codebase: `${buildFolder}/js/codebase/`,
        init: `${buildFolder}/init/`,
    },
    src: {
        js: `${srcFolder}/js/app.js`,
        codebase: `${srcFolder}/js/codebase/**/*.*`,
        init: `${srcFolder}/init/**/*.*`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        svg: `${srcFolder}/img/**/*.svg `,
        scss: `${srcFolder}/scss/style.scss`,
        html:`${srcFolder}/*.html`,
        files: `${srcFolder}/files/**/*.*`,
        
    },
    watch: {
        js: `${srcFolder}/js/**/*.js`,
        codebase: `${srcFolder}/js/codebase/**/*.*`,
        init: `${srcFolder}/init/**/*.*`,
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