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
        const { themeVariables, outputFilePath } = this.options;
        compiler.hooks.afterEnvironment.tap('GenerateTheme', (err) => {
            generateTheme(this.options).then(() => console.log(chalk.green('afterEnvironment 生成主题色成功')));
        });
        compiler.hooks.watchRun.tapAsync('GenerateTheme', ({modifiedFiles}, callback) => {
            if (!modifiedFiles || !modifiedFiles.size) {
                callback();
                return;
            }
            // 取出更改的 less 文件
            const lessFiles = [];
            modifiedFiles.forEach(function (updateFile) {
                if (path.extname(updateFile) === '.less') {
                    lessFiles.push(updateFile);
                }
            })
            if (!lessFiles.length) {
                callback();
                return;
            }
            // 文件中是否使用主题色变量
            const hasThemeVariablesFiles = _.filter(lessFiles, (lessFile) => {
                const content = fs.readFileSync(lessFile, 'utf-8');
                const usedThemeVariables = _.filter(themeVariables, (themeVariable) => {
                    return content.includes(themeVariable);
                });
                return usedThemeVariables.length;
            });
            if (!hasThemeVariablesFiles.length) {
                callback();
                return;
            }
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
    }
}

module.exports = GenerateTheme;
