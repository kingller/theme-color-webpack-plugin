标签：
<font color=green>新增</font>
<font color=orange>修改</font>
<font color=blue>增强</font>
<font color=red>修复</font>
<font color=red><strong>删除</strong></font>


# 3.1.0
1. <font color=orange>修改</font> 判断是否含有主题色变量改为 `/var\(--primary-[\w-]+\)/`


# 3.0.1
1. <font color=red>修复</font> 编译错误 Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: chalk
```
chalk       5.3.0   =>  4.1.2
```


# 3.0.0
1. <font color=green>新增</font> `globalVarFile` 配置 `less` 变量文件路径，文件中的 `less` 变量会从所有less文件中把对应css变量替换成less变量
2. <font color=green>新增</font> `findMissVar` 配置 `globalVarFile` 文件中与主题色相关的变量引用了其它文件的变量且该变量不是 `varFile` 中定义的变量时，是否要把引用的变量加入到主题色变量里来，防止编译时报错。


# 2.0.0
1. <font color=blue>增强</font> 支持webpack 5


# 1.1.0
1. <font color=blue>增强</font> 优化编译性能


# 1.0.4
1. <font color=red>修复</font> 文件不变，不需要重新生成时，去除提示


# 1.0.3
1. <font color=red>修复</font> 生成路径从`path.basename`改为`path.dirname`


# 1.0.2
1. <font color=red>修复</font> 添加`lodash`至`dependencies`


# 1.0.1
1. <font color=red>修复</font> 实时生成主题色文件
