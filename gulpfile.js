var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function(next) {
    return gulp.src(__dirname + '/test/test-*.js', {read: false})
        .pipe(mocha({reporter: 'spec'}))

    next();
});

gulp.task('default', ['test']);