var path = require('path');
var util = require('util');
var gutil = require('gulp-util');
var through = require('through2');
var Promise = require('bluebird');
var guid = require('guid');
var fs = require('fs');

var gulp = require('gulp')

var source = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer')
var handlebars = require('gulp-handlebars')
var wrap = require('gulp-wrap')
var declare = require('gulp-declare');

var PLUGIN_NAME = 'gulp-copy-content';

module.exports = function(options) {

    return through.obj(function(file, enc, cb) {

        var self = this;

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        //显示传入的文件名
        var filename = file.relative.split(".")[0];

        var reg = options.reg;

        if (!util.isRegExp(reg)) {
            gutil.log(gutil.colors.red('[ERROR] reg is required'));
            this.push(file);
            return cb();
        }

        var content = file.contents.toString();

        var promises = [];

        content = content.replace(reg, function(str, includeSrc) {

            var fs = Promise.promisifyAll(require('fs'));

            includeSrc = path.join(options.baseSrc || "", includeSrc);

            var name = includeSrc.split("\/")[includeSrc.split('\/').length - 1].split('.')[0];

            var data = fs.readFileSync(includeSrc);
            return data;
        })

        Promise.all(promises)
            .then(function(map) {

                var dest = options.dest || '';
                var namespace = options.namespace || 'templates';

                map.forEach(function(obj) {

                    var stream = source(obj.name);
                    stream.write(obj.value);
                    process.nextTick(function() {
                        stream.end();
                    });

                    stream
                        .pipe(vinylBuffer())
                        .pipe(gulp.dest(dest + filename));
                });

                file.contents = new Buffer(content);
                self.push(file);

                cb();
            })
            .catch(function(e) {
                gutil.log(gutil.colors.red('[ERROR] file  precompile failed, ' + e));
            });

    });
};
