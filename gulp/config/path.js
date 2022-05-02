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
        files: `${buildFolder}/files/`
    },

    src: {
        js: `${srcFolder}/js/index.js`,
        scss: `${srcFolder}/scss/style.scss`,
        html: `${srcFolder}/*.html`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        svg: `${srcFolder}/img/**/*.svg`,
        files: `${srcFolder}/files/**/*.*`
    },

    watch: {
        js: `${srcFolder}/js/**/*.js`,
        scss: `${srcFolder}/scss/**/*.scss`,
        html: `${srcFolder}/**/*.html`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`,
        files: `${srcFolder}/files/**/*.*`
    },

    clean: buildFolder,
    buildFolder,
    srcFolder,
    rootFolder
}