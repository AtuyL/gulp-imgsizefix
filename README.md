gulp-imgsizefix
===============

fix an IMG tags width and height attributes.

## Usage

```javascript
var
  gulp = require("gulp"),
  imgsizefix = require("gulp-imgsizefix");

gulp.task("default", function () {
  gulp.src("./www/index.html")
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
```

## Task Results

### Input

```html
<!-- absolute path -->
<img src="/img/128x64.gif" width>
<img src="/img/128x64.gif" height>
<img src="/img/128x64.gif" width height>
<!-- remote path -->
<img src="http://example.com/img/128x64.gif" width>
<img src="http://example.com/img/128x64.gif" height>
<img src="http://example.com/img/128x64.gif" width height>
<!-- relative path -->
<img src="./img/128x64.gif" width>
<img src="./img/128x64.gif" height>
<img src="./img/128x64.gif" width height>
```

### Output
```html
<!-- absolute path -->
<img src="/img/128x64.gif" width="128">
<img src="/img/128x64.gif" height="64">
<img src="/img/128x64.gif" width="128" height="64">
<!-- remote path -->
<img src="http://example.com/img/128x64.gif" width="128">
<img src="http://example.com/img/128x64.gif" height="64">
<img src="http://example.com/img/128x64.gif" width="128" height="64">
<!-- relative path -->
<img src="./img/128x64.gif" width="128">
<img src="./img/128x64.gif" height="64">
<img src="./img/128x64.gif" width="128" height="64">
```

## Force Option

```javascript
var
  gulp = require("gulp"),
  imgsizefix = require("gulp-imgsizefix");

gulp.task("default", function () {
  gulp.src("./www/index.html")
    .pipe(imgsizefix({
      paths: {
        "www/": [
          new RegExp("^\\/"),
          "http://example.com"
        ]
      },
      force: true // <-- default: false
    }))
    .pipe(gulp.dest('./www'));
});
```

## Task Results

### Input

```html
<!-- absolute path -->
<img src="/img/128x64.gif">
<img src="/img/128x64.gif">
<img src="/img/128x64.gif">
<!-- remote path -->
<img src="http://example.com/img/128x64.gif">
<img src="http://example.com/img/128x64.gif">
<img src="http://example.com/img/128x64.gif">
<!-- relative path -->
<img src="./img/128x64.gif">
<img src="./img/128x64.gif">
<img src="./img/128x64.gif">
```

### Output
```html
<!-- absolute path -->
<img src="/img/128x64.gif" width="128">
<img src="/img/128x64.gif" height="64">
<img src="/img/128x64.gif" width="128" height="64">
<!-- remote path -->
<img src="http://example.com/img/128x64.gif" width="128">
<img src="http://example.com/img/128x64.gif" height="64">
<img src="http://example.com/img/128x64.gif" width="128" height="64">
<!-- relative path -->
<img src="./img/128x64.gif" width="128">
<img src="./img/128x64.gif" height="64">
<img src="./img/128x64.gif" width="128" height="64">
```
