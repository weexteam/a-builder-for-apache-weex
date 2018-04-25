#!/usr/bin/env node
const program = require('commander')
const builder = require('../index')
const chalk = require('chalk')
const Gauge = require('gauge')
const pathTool = require('path')
const binname = 'weex'
let showHelp = true

// rename the cmdname for weex-toolkit
program._name = `${binname} compile`

program.version(require('../package.json').version)
    .option('-e,--ext [ext]', 'set enabled extname for compiler default is vue|we')
    .option('-web,--web', 'set web mode for h5 render')
    .option('-w,--watch', 'watch files and rebuild')
    .option('-d,--devtool [devtool]', 'set webpack devtool mode')
    .option('-m,--min', 'compress the output js (will disable inline-source-map)')
    .option('-c,--config [path]', 'compile with a config file')
    .option('-b,--base [path]', 'set source base path')
    .arguments('<source> <dest>')
    .action(function (source, dest) {
        showHelp = false
        let gauge = new Gauge()
        let maxProgress = 0
        builder.build(source, dest, {
            onProgress: function (complete, action) {
                if (complete > maxProgress) {
                    maxProgress = complete
                }
                else {
                    complete = maxProgress
                }
                gauge.show(action, complete)
            },
            watch: program.watch,
            devtool: program.devtool,
            ext: pathTool.extname(source) || program.ext || 'vue|we',
            web: !!program.web,
            min: !!program.min,
            config: program.config,
            base: program.base
        }, function (err, output, json) {
            gauge.hide()
            if (err) {
                console.log(chalk.red('Build Failed!'))
                console.error(err)
            }
            else {
                console.log('Build completed!\nChild')
                console.log(output.toString())
            }

        })
})
program.parse(process.argv)
if (showHelp)program.outputHelp()