/// <binding BeforeBuild='build.css.sass, copy.htmlfiles.www, tslint' />
'use strict';
/// <binding BeforeBuild='build.css.sass, copy.htmlfiles.www, tslint' />
var gulp = require('gulp');
var tsd = require('gulp-tsd');
var tslint = require('gulp-tslint');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var marked = require('gulp-marked');
// upgrade to the latest node version or use e6-promise.  Fixes problem with `gulp-postcss "Promise is not defined"`
require('es6-promise').polyfill();

gulp.task('install.tsd.files', function (callback) {
    tsd({
        command: 'reinstall',
        config: '.tsd.json'
    }, callback);
});

gulp.task('tslint', function () {
    var tslintConfig = {
        "rules": {
            "semicolon": true,
            "requireReturnType": true,
            "requireParameterType": true,
            "jsdoc-format": true,
            "quotemark": [true, "single"],
            "variable-name": [true, "allow-leading-underscore"]
        }
    };

    return gulp.src(['scripts/**/*.ts', '!scripts/typings/**'])
        //Custom rules can be added to configuration.  rulesDirectory: 'folder/folder'
      .pipe(tslint({ configuration: tslintConfig }))
      .pipe(tslint.report('verbose', { emitError: true, reportLimit: 0 }));

});


require('es6-promise').polyfill();
gulp.task('build.css.sass', function () {
    gulp.src(['./scripts/test/cssbutton/components/**/*.scss', './scripts/test/cssbutton/components/**/*.css'])
    // Guilp-Sass runs the pre processor on the .scss files using Sass.
    // Gulp-AutoPrefixer post processes the .css files using PostCSS.
    // CSS and Folder structure is saved to destination folder.
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./www/components/'))
    .pipe(browserSync.stream());
});

gulp.task('copy.htmlfiles.www', function () {
    gulp.src(['./scripts/test/cssbutton/components/**/*.html', './scripts/test/md-to-html/**/*.html'])
    .pipe(gulp.dest('./www/components/'));
});

gulp.task('browser.sync.js-watch', ['js'], browserSync.reload);

gulp.task('browser.sync', function () {
    browserSync.init({
        server: {
            baseDir:"./www/"
        }
    });
    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("js/*.js", ['browser.sync.js-watch']);
});

gulp.task('convert.MD.HTML', function () {
    gulp.src('./scripts/test/md-to-html/samplemd/*.md')
      .pipe(marked({
          // optional : marked options 
      }))
      .pipe(gulp.dest('./scripts/test/md-to-html/md-html/'))
});
