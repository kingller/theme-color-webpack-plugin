const chalk = require('chalk');
const { generateTheme } = require('theme-color-generator');

class GenerateTheme {
    constructor(options) {
        this.options = options;
        this.isInitLoad = true;
    }

    apply(compiler) {
        compiler.hooks.watchRun.tapAsync('GenerateTheme', (err, callback) => {
            if (this.isInitLoad) {
                this.isInitLoad = false;
                generateTheme(this.options).then(() => {
                    console.log(chalk.green('生成主题色成功'));
                    callback();
                });
            } else {
                callback();
            }
        });
        compiler.hooks.beforeRun.tapAsync('GenerateTheme', (err, callback) => {
            if (this.isInitLoad) {
                this.isInitLoad = false;
                generateTheme(this.options).then(() => {
                    console.log(chalk.green('生成主题色成功'));
                    callback();
                });
            } else {
                callback();
            }
        });
    }
}

module.exports = GenerateTheme;
