// import gulp from 'gulp'
// import del from "del";
// import browserSync from 'browser-sync';

// import fs from 'fs'
// import fonter from 'gulp-fonter'
// import ttf2woff2 from 'gulp-ttf2woff2'

// export function otfToTtf () {
//     return gulp.src(`${app.path.srcFolder}/fonts/*.otf`)
//         .pipe(fonter({
//             formats: ['ttf']
//         }))
//         .pipe(gulp.dest(`${app.path.srcFolder}/fonts/`))
// };

// export function ttfToWoff () {
//     return gulp.src(`${app.path.srcFolder}/fonts/*.ttf`)
//         .pipe(fonter({
//             formats: ['woff']
//         }))
//         .pipe(gulp.dest(app.path.build.fonts))
//         .pipe(gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
//         .pipe(ttf2woff2())
//         .pipe(gulp.dest(app.path.build.fonts))
// };

// export function fontsStyle() {
//     const fontsFile = `${app.path.srcFolder}/scss/fonts.scss`

//     fs.readdir(app.path.build.fonts)
// }