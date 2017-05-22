var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('lint', function() {
    return gulp.src('src/js/source/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compilar  Sass
gulp.task('sass', function () {
  return gulp.src('src/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'));
});

// Concatenar & Minify JS
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// vigilar cambios en los archivos
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('./sass/**/*.scss', ['sass']);

    //gulp.watch('scss/*.scss', ['sass']);
});

// tarea default
gulp.task('default', ['lint', 'sass', 'scripts']);
