"use strict";

var
  gulp = require("gulp"),
  rename = require("gulp-rename"),
  imgsizefix = require("../");

gulp.task("default", function () {
  gulp.src("./www/_index.html")
    .pipe(rename("index.html"))
    .pipe(imgsizefix({
      paths: {
        "www/": [
          new RegExp("^\\/"),
          "http://example.com"
        ]
      }
    }))
    .pipe(gulp.dest('./www'));
});