#!/usr/bin/env node
/**
 * Created by exolution on 17/1/9.
 */
const program = require('commander')
const builder = require('../builder.js')
const chalk = require('chalk')
const Gauge = require('gauge')
const pathTool = require('path')
let showHelp = true
program.version(require('../package.json').version)
    .option('-v,--version', 'show version')
    .option('-e,--ext [ext]', 'set enabled extname for compiler default is vue|we')
    .option('-web,--web', 'set web mode for h5 render')
    .option('-w,--watch', 'watch files and rebuild')
    .option('-d,--devtool [devtool]', 'set webpack devtool mode')
    .option('-m,--min', 'compress the output js (will disable inline-source-map)')
    .arguments('<source> <dest>')
    .action(function (source, dest) {
        showHelp = false
        let gauge = new Gauge()
        let maxProgress = 0
        let babelConfig
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
            ext: pathTool.extname(source) || program.ext || 'vue',
            web: !!program.web,
            min: !!program.min,
        }, function (err, output, json) {
            gauge.hide()
            if (err) {
                console.log(chalk.red('Build Failed!'))
                console.error(chalk.red(err))
                if (err.stack)console.error(err.stack)
            }
            else {
                console.log('Build completed!\nChild')
                console.log(output.toString())
                console.log(`Time: ${chalk.bold(json.time)}ms`)
            }

        })
    })
program.parse(process.argv)
if (showHelp)program.outputHelp()