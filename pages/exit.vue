<template>
  <div class="" />
</template>

<script>
export default {
  layout: 'blank',
  // 因为要到达页面时自动执行，所以要用中间件
  middleware: async (ctx) => {
    const { status, data } = await ctx.$axios.get('/users/exit')
    if (status === 200 && data && data.code === 0) {
      window.location.href = '/'
    }
  }
}
</script>
