<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App'
}
</script>
<style>
  /*.el-scrollbar__wrap {*/
    /*overflow-x: hidden !important;*/
  /*}*/
  .el-upload{
    width: 100%;
  }
  .el-upload .el-button{
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: 0px;
  }

  .el-card__header {
    background-color: ghostwhite;
  }
</style>
