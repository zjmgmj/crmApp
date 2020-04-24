<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
  nb-content
</template>

<script>
  export default {
    props: {
      navigation: {
        type: Object
      }
    }
  }
</script>