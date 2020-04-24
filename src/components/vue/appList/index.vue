<template lang="pug">
view
  flat-list(:data="listData", :refreshing="pullRefresh", :onRefresh="onPullRefresh", :onEndReachedThreshold="bottomDistance", :horizontal="horizontal", :keyExtractor="keyItems", :onEndReached="loadMore")
    //- slot(name="renderItem")
    view(render-prop-fn="renderItem")
      slot(name="renderItem")
      //- nb-text {{args.item.name}}
    //- view(render-prop="ListFooterComponent", :style="{paddingVertical: 20}")
      nb-text 33345
    //- slot
  //- view(render-prop="ListEmptyComponent", v-if="hasEmptyView")
  //-   slot(name="emptyView")
  //- //- view(render-prop="ListHeaderComponent", v-if="hasTopView")
  //-   slot(name="topView")
  //- view(render-prop="ListFooterComponent", :style="{paddingVertical: 20, alignItems: 'center'}")
  //-   nb-text(:style="{color: pushBottomColor}") {{pushBottomText}}

</template>

<script>
  // 暂时保留
  export default {
    props: {
      hasTopView: {
        type: Boolean,
        default: false
      },
      hasEmptyView: {
        type: Boolean,
        default: false
      },
      horizontal: {
        type: Boolean,
        default: false
      },
      pullRefresh: {
        type: Boolean,
        default: false
      },
      onPullRefresh: {
        default: null
      },
      listData: {
        type: Array,
        required: true
      },
      pushBottomText: {
        type: String,
        default: '加载中...'
      },
      pushBottomColor: {
        type: String,
        default: '#ddd'
      },
      bottomDistance: {
        type: Number,
        default: 0.1
      },
      loadMore: {
        default: null
      }
    },
    data () {
      return {
        keyItems: (item, index) => index.toString()
      }
    }
  }
</script>