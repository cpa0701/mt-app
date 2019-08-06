<template>
  <el-row :gutter="0" class="m-header">
    <el-col :span="5">
      <geo />
    </el-col>
    <el-col :span="5">
      <user />
    </el-col>
    <el-col :span="14">
      <navbar />
    </el-col>
  </el-row>
</template>

<script>
import geo from './geo'
import user from './user'
import navbar from './nav'

export default {
  name: 'Index',
  components: {
    geo,
    user,
    navbar
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/public/layout.scss";
  @import "@/assets/css/public/header/index.scss";
</style>
