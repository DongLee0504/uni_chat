# 项目

## 环境变量

- uniapp 中只有 development 和 production 这两个条件

## appid

- 可以使用微信官方的测试号

# vue3

## 父组件调用子组件方法

- 需要使用 `defineExpose` 将子组件方法暴露出去
- `defineExpose` 不需要单独引入
  ```js
  // 暴露方法，供父组件调用
  defineExpose({
    handleLogin,
  });
  ```
