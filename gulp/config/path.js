import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = './dist';
const srcFolder = './src';

export const path = {
    build: {
        js:`${buildFolder}/js/`,
        css:`${buildFolder}/css/`,
        html:`${buildFolder}/`,
        images:`${buildFolder}/images/`,
        
        files: `${buildFolder}/files/`,
        codebase: `${buildFolder}/js/codebase/`,
        init: `${buildFolder}/init/`,
        fonts: `${buildFolder}/fonts/`,
    },
    src: {
        js: `${srcFolder}/js/app.js`,
        codebase: `${srcFolder}/js/codebase/**/*.*`,
        init: `${srcFolder}/init/**/*.*`,
        fonts: `${srcFolder}/fonts/**/*.*`,
        images: `${srcFolder}/images/**/*.*`,
        svg: `${srcFolder}/images/**/*.svg `,
        scss: `${srcFolder}/scss/expa.scss`,
        html:`${srcFolder}/*.html`,
        files: `${srcFolder}/files/**/*.*`,
        
    },
    watch: {
        js: `${srcFolder}/js/**/*.js`,
        codebase: `${srcFolder}/js/codebase/**/*.*`,
        init: `${srcFolder}/init/**/*.*`,
        fonts: `${srcFolder}/fonts/**/*.*`,
        scss: `${srcFolder}/scss/**/*.scss`,
        html: `${srcFolder}/**/*.html`,
        images: `${srcFolder}/images/**/*.*`,
        files: `${srcFolder}/files/**/*.*`
    }, 
    clean: buildFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
    ftp: ``
};