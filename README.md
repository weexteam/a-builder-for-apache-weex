# weex-builder

[![Build Status](https://travis-ci.org/weexteam/weex-builder.svg?branch=master)](https://travis-ci.org/weexteam/weex-builder)
[![dependcy](https://david-dm.org/weexteam/weex-builder.svg)](https://david-dm.org/weexteam/weex-builder)
[![dev dependcy](https://david-dm.org/weexteam/weex-builder/dev-status.svg)](https://david-dm.org/weexteam/weex-builder?type=dev)

a weex compiler tool 
used by weex-toolkit (bind on "weex compile")

## usage

`$ npm install -g weex-builder`

>we suggest you use [weex-toolkit](https://github.com/weexteam/weex-toolkit)

### CLI

### command

1. compile all files in directory `path/to/src` and output to `path/to/dist`
```
weex-builder path/to/src  path/to/dist
```

2. compile all vue files in directory `path/to/src` and output to `path/to/dist`
```
weex-builder path/to/src/\*.vue path/to.dist
```


3. compile all vue/we files but except index.we in directory `path/to/src` and output to `path/to/dist`
```
weex-builder path/to/src/\*.vue,\*.we,^index.we path/to.dist
```



### options

```
    -h, --help           output usage information
    -v,--version         show version
    --ext [ext]          set enabled extname for compiler default is vue|we
    --web                set web mode for h5 render
    -w,--watch           watch files and rebuild
    --devtool [devtool]  set webpack devtool mode
    --min                compress the output js (will disable inline-source-map)
    --filename           set filename template of webpack, like `[name].web.js`
```

### Node

```
const weexBuilder = require('weex-builder');
const source = 'src';
const dest = 'dest';

weexBuilder(source, dest, {
    recursive, true
}, (err, output, json) => {
    if (err) {
        console.log(chalk.red('Build Failed!'))
        err.forEach(e => console.error(e))
    }
    else {
        console.log('Build completed!\nChild')
        console.log(output.toString())
    }
})

```

## Lisence

MIT