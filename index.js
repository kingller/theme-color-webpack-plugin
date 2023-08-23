'use strict';

const chalk = require('chalk');
const { generateTheme } = require('theme-color-generator');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const lessToJs = require('less-vars-to-js');

class GenerateTheme {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        const { themeVariables, outputFilePath, varFile, globalVarFile } = this.options;
        compiler.hooks.afterEnvironment.tap('GenerateTheme', (err) => {
            generateTheme({ findMissVar: true, ...this.options }).then(() =>
                console.log(chalk.green('afterEnvironment 生成主题色成功'))
            );
        });
        compiler.hooks.watchRun.tapAsync('GenerateTheme', ({ modifiedFiles }, callback) => {
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
            });
            if (!lessFiles.length) {
                callback();
                return;
            }
            const themeVars = themeVariables || [];
            if (!themeVariables && varFile) {
                const varsJs = lessToJs(fs.readFileSync(varFile, 'utf-8'));
                Object.keys(varsJs).forEach((varName) => {
                    themeVars.push(varName);
                });
            }
            // 文件中是否使用主题色变量
            const hasThemeVariablesFiles = _.some(lessFiles, (lessFile) => {
                const content = fs.readFileSync(lessFile, 'utf-8');
                if (globalVarFile) {
                    // 传入 globalVarFile 的，使用了 var(--primary-[\w-]+) 的匹配主题色
                    if (/var\(--primary-[\w-]+\)/.test(content)) {
                        return true;
                    }
                }
                const usedThemeVariables = _.some(themeVars, (themeVariable) => {
                    return content.includes(themeVariable);
                });
                return usedThemeVariables;
            });
            if (!hasThemeVariablesFiles) {
                callback();
                return;
            }
            const outputDir = path.dirname(outputFilePath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }
            const isExistCSSFile = fs.existsSync(outputFilePath);
            generateTheme({ findMissVar: true, ..._.omit(this.options, 'outputFilePath') }).then((css) => {
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
