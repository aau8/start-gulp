import gulp from 'gulp'
import svgSprite from "gulp-svg-sprite"

export default function sprite() {
	return gulp.src(app.path.src.svgIcons)
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: '../img/sprite.svg',
					// example: true
				}
			},
			shape: {
				id: {
					separator: '',
					generator: ''
				},
				// transform: [
				// 	{
				// 		svgo: {
				// 			plugins: [
				// 				{ removeXMLNS: true },
				// 				{ convertPathData: false },
				// 				{ removeViewBox: false },
				// 			]
				// 		}
				// 	}
				// ]
			},
			svg: {
				rootAttributes: {
					"style": "display: none;",
					"aria-hidden": true
				},
				xmlDeclaration: false
			}
		}))
		.pipe(gulp.dest(app.path.srcFolder));
}