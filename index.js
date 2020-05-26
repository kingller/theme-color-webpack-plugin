'use strict';

const chalk = require('chalk');
const { generateTheme } = require('theme-color-generator');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

class GenerateTheme {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.watchRun.tapAsync('GenerateTheme', (err, callback) => {
            const { outputFilePath } = this.options;
            const outputDir = path.dirname(outputFilePath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }
            const isExistCSSFile = fs.existsSync(outputFilePath);
            generateTheme(_.omit(this.options, 'outputFilePath')).then(css => {
                if (!isExistCSSFile || css !== fs.readFileSync(outputFilePath, 'utf-8')) {
                    console.log(chalk.green('生成主题色成功'));
                    fs.writeFileSync(outputFilePath, css);
                }
                callback();
            });
        });
        compiler.hooks.beforeRun.tapAsync('GenerateTheme', (err, callback) => {
            generateTheme(this.options).then(() => {
                console.log(chalk.green('生成主题色成功'));
                callback();
            });
        });
    }
}

module.exports = GenerateTheme;
