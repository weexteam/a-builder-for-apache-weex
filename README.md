# weex-builder
a weex compiler tool 
used by weex-toolkit (bind on "weex compile")

# usage
npm install -g weex-builder 

>we suggest you use [weex-toolkit](https://github.com/weexteam/weex-toolkit)
```
weex-builder path/to/src  path/to/dist
```
compile all files in directory `path/to/src` and output to `path/to/dist`
```
weex-builder path/to/src/\*.vue path/to.dist
```
compile all vue files in directory `path/to/src` and output to `path/to/dist`
```
weex-builder path/to/src/\*.vue,\*.we,^index.we path/to.dist
```
compile all vue/we files but except index.we in directory `path/to/src` and output to `path/to/dist`
```
Options:

    -h, --help           output usage information
    -v,--version         show version
    --ext [ext]          set enabled extname for compiler default is vue|we
    --web                set web mode for h5 render
    -w,--watch           watch files and rebuild
    --devtool [devtool]  set webpack devtool mode
    --min                compress the output js (will disable inline-source-map)
```
