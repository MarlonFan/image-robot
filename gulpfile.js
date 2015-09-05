var fs = require('fs');
var gulp = require('gulp');
var globby = require('globby');

var exec = require('child_process').exec;

var config = require('./dest/config');

gulp.task('sync-tsconfig', function name(callback) {
    var tsConfig = require('./tsconfig.json');
    globby(tsConfig.filesGlob)
        .then(function(paths) {
            tsConfig.files = matches;
            fs.writeFile('tsconfig.json', JSON.stringify(tsConfig, null, '    ') + '\n', callback); 
        });
});

gulp.task('build', function (callback) {
    build(callback, false);
});

gulp.task('build-and-watch', function (callback) {
    build(callback, true);
});

function build(callback, watch) {
    var command;
    var tscJsFile = config.dev && config.dev.tscJsFile;
    
    if (tscJsFile) {
        command = 'node "' + tscJsFile + '"';
    } else {
        command = 'tsc';
    }
    
    if (watch) {
        command += ' -w';
    }
    
    var cp = exec(command, callback);
    
    cp.stdout.pipe(process.stdout);
    cp.stderr.pipe(process.stdout);
}