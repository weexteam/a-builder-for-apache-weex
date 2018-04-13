const WeexBuilder = require('./src/weexBuilder');
const RaxBuilder=require('./src/raxBuilder')
exports.build = function (source, dest, options,callback) {
    if(!source||typeof source!=='string'||(Array.isArray(source)&&source.length==0)){
        return Promise.reject('The source path can not be empty!');
    }
    if(!dest||typeof source!=='string'){
        return Promise.reject('The output path can not be empty or non-string!');
    }
    if(options.rax){
        return new RaxBuilder(source,dest,options).build(callback)
    }
    else {

        return new WeexBuilder(source, dest, options).build(callback);
    }
}