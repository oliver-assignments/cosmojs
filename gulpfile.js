var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('bundle', ()=> {
  return browserify('app/app.js')
    .bundle()
    .pipe(source('appBundle.js'))
    .pipe(gulp.dest('src'));
});

gulp.task('scripts', ['bundle'], () => {
	return gulp.src('src/appBundle.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('public/js'))
});


gulp.task('watch', () => {
	gulp.watch('./app/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'watch']);