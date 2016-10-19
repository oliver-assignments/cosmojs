var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

// Lint Task
gulp.task('lint', () => {
	return gulp.src('public/js/app/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', () => {
	return gulp.src('public/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', () => {
	return gulp.src('public/js/app/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', () => {
	gulp.watch('public/js/app/**/*.js', ['scripts']);
	gulp.watch('public/scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'watch']);