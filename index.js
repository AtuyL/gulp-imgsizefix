"use strict";

var imgsizefix = require('imgsizefix'),
    stream = require('stream');

module.exports = function (options) {
    var transform = new stream.Transform({
        objectMode: true
    });
    transform._transform = function (file, encoding, callback) {
        imgsizefix(file.contents, file.path, options, function (error, result) {
            file.contents = new Buffer(result);
            callback(error, file);
        });
    };
    return transform;
};