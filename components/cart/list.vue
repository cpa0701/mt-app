<template>
  <el-table
    :data="cartData"
    style="width: 980px"
  >
    <el-table-column
      label="项目"
      prop="name"
      width="532"
    />
    <el-table-column
      label="单价"
      width="132"
      prop="price"
    />
    <el-table-column
      label="数量"
      width="212"
      prop="count"
    >
      <template slot-scope="scope">
        <el-input-number
          v-model="scope.row.count"
          :min="0"
        />
      </template>
    </el-table-column>
    <el-table-column
      label="总价"
      prop="price"
    >
      <template slot-scope="scope">
        <div class="">
          {{ scope.row.price*scope.row.count }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'List',
  props: {
    cartData: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
