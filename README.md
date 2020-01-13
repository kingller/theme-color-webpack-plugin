# theme-color-webpack-plugin

This webpack plugin is for generate color specific styles/less file which you can use to change theme dynamically in browser

## Install
```
$ npm install -D theme-color-webpack-plugin
```

## Example:

webpack configuration (`webpack.config.js`):

```
const ThemeColorWebpackPlugin = require('theme-color-webpack-plugin');

const options = {
  stylesDir: path.join(__dirname, './src/styles'), // styles directory containing all less files
  varFile: path.join(__dirname, './src/styles/variables.less'), // include all color variables in `varFile` that you want to change dynamically
  themeVariables: ['@theme-color'], // (Optional) Specify variables to use (If not set, all variables in varFile will be used)
  outputFilePath: path.join(__dirname, './public/color.less'), // if provided, file will be created with generated less/styles
  include: ['./**/*.less'], // (Optional) Specify the included file. Here is its default value. It will be used as path.join(stylesDir, './**/*.less') to relative path.
  options: {} // (Optional) less options
}

module.exports = {
  // ...
  plugins: [new ThemeColorWebpackPlugin(options)]
};
```
## Note: include all color variables in `varFile` that you want to change dynamically and assign them unique color codes. Don't assign same color to two or more variables and don't use `#fff`, `#ffffff`, `#000` or `#000000`. If you still want white or black color as default, slightly change it e.g. `#fffffe` or `#000001` which will not replace common background colors from other components.

## You can switch theme in two ways:

### First way
Add following lines in your main html file

```
<link rel="stylesheet/less" type="text/css" href="/color.less" />
<script>
  window.less = {
    async: false,
    env: 'production'
  };
</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"></script>
```

Now you can update colors by updating less variables like this

```
window.less.modifyVars({
  '@theme-color': '#0035ff'
})
```

### Second way
You can go to [theme-color-switch](https://github.com/kingller/theme-color-switch) to see the usage