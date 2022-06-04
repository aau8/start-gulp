import path from 'path'
const rootFolder = path.basename(path.resolve())

const buildFolder = './dist'
const srcFolder = './src'

export default {
    build: {
        js: `${buildFolder}/js/`,
        css: `${buildFolder}/css/`,
        html: `${buildFolder}/`,
        images: `${buildFolder}/img/`,
        convertImages: `./convert-images/`,
        resources: `${buildFolder}/resources/`,
    },

    src: {
        js: `${srcFolder}/js/index.js`,
        scss: `${srcFolder}/scss/style.scss`,
        html: `${srcFolder}/*.html`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        svg: `${srcFolder}/img/**/*.svg`,
        svgIcons: `${srcFolder}/icons-to-sprite/**/*.svg`,
        convertImages: `./convert-images/**/*.*`,
        resources: `${srcFolder}/resources/**/*.*`,
    },

    watch: {
        js: `${srcFolder}/js/**/*.js`,
        scss: `${srcFolder}/scss/**/*.{scss,sass,css}`,
        html: `${srcFolder}/**/*.html`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        convertImages: `convert-images/**/*.*`,
        svg: `${srcFolder}/img/**/*.svg`,
        resources: `${srcFolder}/resources/**/*.*`,
    },

    clean: buildFolder,
    buildFolder,
    srcFolder,
    rootFolder
}