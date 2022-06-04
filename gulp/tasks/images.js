import gulp from 'gulp'
import del from "del";
import browserSync from 'browser-sync';
import newer from 'gulp-newer'

import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp'

export function imagesBuild () {
    return gulp.src(app.path.src.images)
        .pipe(newer(app.path.build.images))
        .pipe(app.plugins.if(
            app.isProd,
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3
            })
        ))
        .pipe(gulp.dest(app.path.build.images))
        .pipe(app.plugins.if(
            app.isProd,
            webp()
        ))
        .pipe(gulp.dest(app.path.build.images))

        .pipe(gulp.src(app.path.src.svg))
        .pipe(gulp.dest(app.path.build.images))
        .pipe(browserSync.reload({ stream: true }));
}

export function imagesCopy() {
    return gulp.src(app.path.src.convertImages)
        .pipe(newer(app.path.build.images))
        .pipe(gulp.dest(app.path.build.images))
}

export function convertImages() {
    return gulp.src(app.path.src.images)
        .pipe(newer(app.path.build.convertImages))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(gulp.dest(app.path.build.convertImages))
        .pipe(webp())
        .pipe(gulp.dest(app.path.build.convertImages))

        .pipe(gulp.src(app.path.src.svg))
        .pipe(gulp.dest(app.path.build.convertImages))
        .pipe(browserSync.reload({ stream: true }));
}