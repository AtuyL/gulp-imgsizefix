"use strict";

var
  Stream = require('stream'),
  FS = require('fs'),
  Path = require('path'),
  Parser = require('imagesize').Parser,
  REG = {
    // tag: new RegExp("<\\s*img[^>]*\\s+(width|height)(\\s*)=(\\s*)[\"\']\\$[\"\'][^>]*>", "im"),
    tag: new RegExp("<\\s*img[^>]*\\s+(width|height)(?:\\s*=\\s*([\"\'])\\$[\"\'])?([\\s>])", "im"),
    src: new RegExp("\\s+src\\s*=\\s*[\"\']([^\"\']+)[\"\']", "im"),
    lazy: new RegExp("\\s+data-lazy\\s*=\\s*[\"\']([^\"\']+)[\"\']", "im"),
    size: new RegExp("(\\s+)(width|height)(?:\\s*=\\s*([\"\'])\\$[\"\'])?([\\s>])", "im"),
    abspath: new RegExp("^(?:https?:\/)?\/", "im")
  };

function imgsizefix(options) {
  options = options || {};
  var paths = options.paths || null;
  return function (file, encoding, callback) {
    var
      tag, imgdata, src, result, parser,
      html = file.contents.toString(),
      dirname = Path.dirname(file.path);

    function embed(tag, result) {
      var size, before, name, bracket, after, value;
      while (true) {
        size = REG.size.exec(tag);
        if (!size) {
          return tag;
        }
        before = size[1];
        name = size[2];
        bracket = size[3] || '"';
        after = size[4];
        value = result[name];
        tag = tag.replace(REG.size, [before, name, "=", bracket, value, bracket, after].join(""));
      }
      return tag;
    }

    function cancel(tag) {
      result = {
        width: "auto",
        height: "auto"
      };
      return embed(tag, result);
    }

    function resolve(src) {
      var imgpath = null;
      if (REG.abspath.test(src)) {
        Object.keys(paths).some(function (to) {
          return paths[to].some(function (exp) {
            if (typeof exp === "string" || exp.test(src)) {
              imgpath = Path.resolve(src.replace(exp, to));
              return true;
            }
            return false;
          });
        });
      } else {
        imgpath = Path.resolve(dirname, src);
      }
      return imgpath;
    }

    function each() {
      tag = REG.tag.exec(html);
      tag = tag ? tag[0] : null;
      if (tag === null) {
        return false;
      }

      src = REG.lazy.exec(tag) || REG.src.exec(tag);
      src = src ? resolve(src[1]) : null;

      if (src === null) {
        html = html.replace(tag, cancel(tag));
        return true;
      }

      try {
        imgdata = FS.readFileSync(src);
        parser = new Parser();
        if (parser.parse(imgdata) !== Parser.DONE) {
          html = html.replace(tag, cancel(tag));
          return true;
        }
        result = parser.getResult();
        html = html.replace(tag, embed(tag, result));
        return true;
      } catch (error) {
        console.error(error.toString());
        console.error(' ', src, 'in', file.path);
        html = html.replace(tag, cancel(tag));
        return true;
      }
    }

    while (true) {
      if (!each()) {
        break;
      }
    }

    file.contents = new Buffer(html);
    callback(null, file);
  };
}

module.exports = function (options) {
  var stream = new Stream.Transform({
    objectMode: true
  });
  stream._transform = imgsizefix(options);
  return stream;
};