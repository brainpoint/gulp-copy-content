
## Installation

```bash
npm install gulp --save-dev
npm install gulp-copy-content --save-dev
```

## Usage

文件目录结构如下：

```
├── gulpfile.js              # gulpfile文件
├── src/                     # 源文件目录
	└── index.html          	 # index.html
  └── template/      	   	   # 模板目录
      └── header.html   		 # 模板文件
└── dist/                    # 编译目录
```

html文件，代码如下

```html
	<!--copyContent "src/template/header.html"-->
```

在根目录创建gulpfile.js，代码如下

```js
var gulp = require('gulp');
var precompile = require('gulp-copy-content');

gulp.task('copy', function(){
    return gulp.src('src/*.html')
       .pipe(precompile({
              reg: /<!\-\-copyContent\s+"([^"]+)"\s+\-\->/g,  // 匹配的文件正则.
              baseSrc: "", // 设置根目录之后不需要编写完整的路径.
        }))
       .pipe(gulp.dest('dist/'))
});

```

执行

```bash
	gulp copy
```

task结束后会将制定的文件内容复制到注释的位置.
