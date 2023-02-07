/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-04-14 15:28:47
 * @LastEditors: Qleo
 * @LastEditTime: 2023-02-07 16:07:24
 */
module.exports = {
  // 字符串使用单引号
  singleQuote: true,
  // 在jsx中把'>' 是否单独放同一行，true同一行，false单独一行，默认false
  jsxBracketSameLine: false,
  // 每行末尾自动添加分号
  semi: false,
  // tab缩进大小,默认为2
  tabWidth: 2,
  // 使用tab缩进，默认false
  useTabs: false,
  // 对象中打印空格 默认true
  // true: { foo: bar }
  // false: {foo: bar}
  bracketSpacing: true,
  // 换行长度，默认80
  printWidth: 120,
  // 对象最后一个属性加逗号
  trailingComma: 'es5',
  // 默认值preserve（保持）。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
  proseWrap: 'never',
  //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  arrowParens: 'avoid',
  jsxBracketSameLine: false,
}
