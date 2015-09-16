/// <binding BeforeBuild='default' ProjectOpened='watch' />
/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */
// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-cssmin'),
    jshint = require('gulp-jshint'),
    debug = require('gulp-debug'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    merge2 = require('merge2'),
    del = require('del');

//list the script files needed to load and be processed
var bowerScripts = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery-ui/jquery-ui.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    //'bower_components/angular-local-storage/dist/angular-local-storage.js',
    //'bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
];

var bowerStyles = [
    //'bower_components/animate.css/animate.css',
    //'bower_components/angular-toastr/dist/angular-toastr.css',
];

function prepScripts(scripts, name) {
    return gulp.src(scripts)
        .pipe(sourcemaps.init())
        .pipe(concat(name))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/js'));
}

function prepScriptsAnalyze(scripts, name) {
    return gulp.src(scripts)
        .pipe(sourcemaps.init())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat(name))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/js'));
}

// Styles
gulp.task('styles', function () {
    return merge2(
            gulp.src('app/styles/main.scss')
                .pipe(sass()),
            gulp.src(bowerStyles),
            gulp.src('app/styles/app.scss')
                .pipe(sass())
        )
        .pipe(concat('main.css'))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(sourcemaps.init())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCss())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/styles'));
});

// Library Scripts
gulp.task('bowerScripts', function () {
    return prepScripts(bowerScripts, 'bowerComponents.js');
});

// App Scripts
gulp.task('appScripts', function () {
    return prepScriptsAnalyze('app/js/**/*.js', 'app.js');
});

// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fontawesome', function () {
    return gulp.src('bower_components/fontawesome/fonts/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('bootstrapFonts', function () {
    return gulp.src('bower_components/bootstrap/fonts/*.*')
        .pipe(gulp.dest('dist/fonts/bootstrap'));
});

// Views task
gulp.task('views', function () {
    // Get our index.html
    gulp.src('app/index.html')
        // And put it in the dist folder
        .pipe(gulp.dest('dist/'));

    // Any other view files from app/views
    gulp.src('./app/views/**/*')
        // Will be put in the dist/views folder
        .pipe(gulp.dest('dist/views/'));
});

// Clean
gulp.task('clean', function (cb) {
    del(['dist/'], cb);
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start(
        'styles',
        'bowerScripts',
        'appScripts',
        'views',
        'fontawesome',
        'bootstrapFonts',
        'images');
});

// Watch
gulp.task('watch', function () {

    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('app/js/**/*.js', ['appScripts']);

    // Watch bower components
    gulp.watch('bower_components/**/*.js', ['bowerScripts']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);

    //watch angular views
    gulp.watch(['app/index.html', 'app/views/**/*.html'], [
        'views'
    ]);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

});