<template lang="pug">
iconfont(:name="name", :size="size", :color="color")
</template>

<script>
  import iconfont from '../../react/iconfont'
  export default {
    props: {
      name: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        default: 20
      },
      color: {
        type: String,
        default: '#cfcfcf'
      }
    },
    components: {
      iconfont
    }
  }
</script>