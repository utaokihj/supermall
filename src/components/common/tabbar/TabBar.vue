<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TabBar"
};
</script>

<style lang="less" scoped>
#tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 49px;
  background-color: #f6f6f6;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 -3px 2px rgba(100, 100, 100, 0.1);
}
</style>