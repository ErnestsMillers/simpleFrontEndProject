const gulp         = require('gulp');
const sass         = require('gulp-sass');
const cleanCss     = require('gulp-clean-css');
const autoPrefixer = require('gulp-autoprefixer');
const useref       = require('gulp-useref');
const uglify       = require('gulp-uglify');
const plumber      = require('gulp-plumber');
const htmlmin      = require('gulp-htmlmin');
const browserSync  = require('browser-sync');
const gulpif       = require('gulp-if');
const clean        = require('gulp-clean');
const runSequence  = require('run-sequence');
const sourcemaps   = require('gulp-sourcemaps');
const reload	   = browserSync.reload;

// Html/Scripts task without minifying
gulp.task('htmlscript', function() {
	gulp.src('app/*.html')
		.pipe(plumber())
		.pipe(useref())
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream:true}));
});

// Scripts
gulp.task('htmlminscriptmin', function() {
	gulp.src('app/*.html')
		.pipe(plumber())
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif(/\.html$/, htmlmin({
	      collapseWhitespace: true,
	      processConditionalComments: true,
	      removeComments: true,
	      removeEmptyAttributes: true,
	      removeScriptTypeAttributes: true,
	      preserveLineBreaks: true,
	      removeStyleLinkTypeAttributes: true,
	      conservativeCollapse: true
	    })))
		.pipe(gulp.dest('dist'))
});

// Sass task without minifying
gulp.task('sass', function() {
	gulp.src('app/styles/*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css'))
		.pipe(reload({stream:true}));
});

// Sass
gulp.task('sassmin', function() {
	gulp.src('app/styles/*.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoPrefixer({
            browsers: ['last 2 versions']
        }))
		.pipe(cleanCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('dist/css'))
});

// Browsersync
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./dist/",
		},
		browser: "chrome"
	});
});

// Copy Images
gulp.task('images', function() {
	gulp.src('app/images/**')
		.pipe(gulp.dest('dist/images'));
});

// Copy Fonts
gulp.task('fonts', function() {
	gulp.src('app/fonts/**')
		.pipe(gulp.dest('dist/fonts'))
});

// MAIN TASKS

// Watch
gulp.task('watch', function() {
	gulp.watch('app/fonts/*', ['fonts']);
	gulp.watch('app/images/*', ['images']);
	gulp.watch('app/*.html', ['htmlscript']);
	gulp.watch('app/styles/*.scss', ['sass']);
});

// Serve Task
gulp.task('serve', function(callback) {
  	runSequence('clean',
  				['sass', 'htmlscript', 'images', 'fonts', 'browser-sync'],
  				['watch'],
                callback);
});

// Build
gulp.task('build', function(callback) {
  	runSequence('clean',
		        ['sassmin', 'htmlminscriptmin', 'images', 'fonts'],
		        callback);
});

// Clean
gulp.task('clean', function() {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});