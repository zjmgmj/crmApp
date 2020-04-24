<template lang="pug">
  //- menu(:style="{flex: 1}")
          m-trigger(:style="{borderWidth: 1, borderColor: 'black'}")
            nb-text 123
          m-opts(:optionsContainerStyle="{width: 100}")
            m-opt
              nb-text 123
            m-opt
              nb-text 456
</template>

<script>
  import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu'
  export default {
    components: {
      // menu: Menu,
      // mOpts: MenuOptions,
      // mOpt: MenuOption,
      // mTrigger: MenuTrigger
    }
  }
</script>