<template lang="pug">
menu-context
  slot
</template>

<script>
  import { MenuContext } from 'react-native-menu'
  export default {
    components: {
      menuContext: MenuContext
    }
  }
</script>
