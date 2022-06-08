import gulp from 'gulp'
import browserSync from 'browser-sync'
import del from 'del'
import htmlBuild from './gulp/tasks/html.js'
import cssBuild from './gulp/tasks/css.js'
import jsBuild from './gulp/tasks/js.js'
import { imagesBuild, convertImages, imagesCopy } from './gulp/tasks/images.js'
import resourcesBuild from './gulp/tasks/resources.js'
import sprite from './gulp/tasks/svg-sprite.js'

const { series, parallel, src, dest, watch } = gulp

import path from './gulp/config/path.js'
import plugins from './gulp/config/plugins.js'

global.app = {
    isProd: process.argv.includes('--production'),
    isDev: !process.argv.includes('--production'),
    path,
    gulp,
    plugins
}

function webServer() {
    browserSync.init({
        // proxy: "", // Для работы с OpenServer (php) указываем папку, с которой работаем в OpenServer.
        server: {
            baseDir: "./dist",
        },
        notify: false,
        port: 3000,
    });
}

function watchFiles() {
    watch(app.path.watch.html, htmlBuild);
    watch(app.path.watch.scss, cssBuild);
    watch(app.path.watch.js, jsBuild);
    watch(app.path.watch.images, imagesBuild);
    watch(app.path.watch.svg, imagesBuild);
    watch(app.path.watch.resources, resourcesBuild);
}

async function cleanDist() {
    await del(`./dist`);
}

const tasks = series(
    htmlBuild,
    cssBuild,
    jsBuild,
    imagesBuild,
    resourcesBuild,
)

export const dev = series(
    cleanDist,
    tasks,
    gulp.parallel(
        watchFiles, 
        webServer
    )
);  

export const prod = series(
    cleanDist,
    tasks,
)

export const prodCopyImages = series(
    cleanDist,
    series(
        htmlBuild,
        cssBuild,
        jsBuild,
        imagesCopy,
        resourcesBuild,
    )
)

export { convertImages }
export { sprite }

gulp.task('default', dev)