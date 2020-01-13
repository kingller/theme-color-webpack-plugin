const chalk = require('chalk');
const { generateTheme } = require('theme-color-generator');
const PLUGIN_NAME = "ThemeColorWebpackPlugin";
const success = msg => console.log(chalk.green(`[${PLUGIN_NAME}] ${msg}`));

class ThemeColorWebpackPlugin {
    constructor(options) {
        this.options = options;
        this.isInitLoad = true;
    }

    apply(compiler) {
        compiler.hooks.watchRun.tapAsync('GenerateTheme', (err, callback) => {
            if (this.isInitLoad) {
                this.isInitLoad = false;
                generateTheme(this.options).then(() => {
                    success('生成主题色成功');
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
                    success('生成主题色成功');
                    callback();
                });
            } else {
                callback();
            }
        });
    }
}

module.exports = ThemeColorWebpackPlugin;
