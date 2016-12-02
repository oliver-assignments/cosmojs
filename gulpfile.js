var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('bundle', [], () => {
  const fast =  
    browserify('./app/app.js')
    .bundle()
    .pipe(source('all.js'))
    .pipe(gulp.dest('public/js'));
  return fast;
});

gulp.task('default', ['bundle'], () => {
  gulp.watch('./app/**/*.js', ['bundle']); 
});