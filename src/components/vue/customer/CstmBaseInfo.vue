<template lang="pug">
view
  view.list-item(v-for="(itm, index) in cstmData.lable", :key="index", :style="[styl.row, styl.bgWhite, styl.borderB1, {paddingLeft: 10, paddingRight: 10}]", v-if="cstmData.data[itm.prop]")
    text(:style="[styl.ft13, styl.ftWeight, styl.color33]") {{itm.lbl}}
    view(:style="styl.col")
      touchable-opacity(:on-press="linkPhoneHandler.bind(this, cstmData.data[itm.prop])", v-if="itm.prop == 'phone'")
        text.textR(:style="[styl.ft13, styl.ftWeight, styl.colorBlue]") {{cstmData.data[itm.prop]}}
      text.textR(:style="[styl.ft13, styl.ftWeight, styl.color99]", v-else) {{cstmData.data[itm.prop]}}
</template>

<script>
import { Linking } from "react-native"
import { ActionSheet } from 'native-base'
  export default {
    data () {
      return {
        btnOptions: [
          { text: "打电话", icon: "call", iconColor: "#4ebdff", type:"tel" },
          { text: "发消息", icon: "chatboxes", iconColor: "green", type:"smsto" }
        ],
        optionCancelIndex: 2,
        optionDestructiveIndex: 1,
        clicked: 0,
        phoneNum: 0
      }
    },
    props: {
      cstmData: {
        type: Object,
        require: true
      }
    },
    methods: {
      linkPhoneHandler: function (num) {
        this.phoneNum = num
        ActionSheet.show({
          options: this.btnOptions,
          cancelButtonIndex: this.optionCancelIndex,
          destructiveButtonIndex: this.optionDestructiveIndex
          // title: "Select An Option"
        },
        buttonIndex => {
          this.clicked = this.btnOptions[buttonIndex]
          if (this.clicked) {
            let url = this.clicked.type + ':' + this.phoneNum
            Linking.canOpenURL(url).then(supported => {
             if (!supported) {
                 console.log('Can\'t handle url: ' + url);
             } else {
                 return Linking.openURL(url);
             }
           }).catch(err => console.warn('An error occurred', err))
          }
        }
      )}
    }
  }
</script>
<style lang="stylus">
  .list-item{
    height: 50;
  }
  .textR {
    textAlign: right
  }
</style>