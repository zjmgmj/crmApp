<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
  view(:style="[{height: 45, backgroundColor: '#FFF'}, styl.borderB1,styl.rowStart]")
    iconfont(name="search",:style="[styl.ml10,styl.mr10]")
  //-   nb-input(v-model="searchKey", placeholder="请输入关键词查询",:onEndEditing="searchChange",:style="[styl.ft14]")
  //- flat-list(:data="dataList", :style="styl.bgColorF2", :onEndReachedThreshold="0.1", :onEndReached="_onEndReached", :refreshing="refreshing", :onRefresh="_onRefresh", :keyExtractor="keyItems")
  flat-list(:data="dataList", :style="styl.bgColorF2", :onEndReachedThreshold="0.5", :onEndReached="_onEndReached.bind(this, queryObject.currentPage)", :refreshing="refreshing", :onRefresh="_onRefresh", :keyExtractor="keyItems", :automaticallyAdjustContentInsets="false", :pageSize="10")
    view(render-prop-fn="renderItem")
      view(:style="[styl.bgWhite, styl.pad10, styl.mt5]")
        touchable-opacity(:on-press="choose.bind(this, args.item)", :style="styl.col")
          view(:style="styl.row")
            nb-text(:style="[styl.col, styl.color33, styl.ft15]") {{args.item.customer.compName}}
          view(:style="[styl.row, styl.mt10]")
            text(:style="[ styl.color88, styl.ft12]") 拜访时间: {{args.item.planVisitTime}}
          view(:style="[styl.row, styl.mt5]", v-if="args.item.customer.compAddr && args.item.customer.compAddr.trim().length > 0")
            text(:style="[styl.color88, styl.ft12]") {{args.item.customer.compAddr}}
    view(render-prop="ListFooterComponent", :style="{paddingVertical: 20}")
      text(:style="styl.textC, styl.ft12, styl.color333") {{endReachedMsg}}
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    data () {
      return {
        searchKey: '',
        dataList: [],
        refreshing: false,
        keyItems: (item, index) => index.toString(),
        queryObject: {
          currentPage:0,
          pageSize: 10,
          orderType: 2,
          uid: 0
        },
        endReachedMsg: '加载中...',
        isEndReached: false,
        pageTimeout: null
      }
    },
    computed: {
      ...mapState({
        currentUser: state => state.currentUser
      })
    },
    beforeMount () {
      this.$nextTick(() => {
        this.queryObject.currentPage = 0
        this.loadData()
      })
    },
    watch: {
      searchKey (newVal, oldVal) {
        console.log(newVal)
        this.searchChange()
      }
    },
    methods: {
      searchChange () {
        this.queryObject.currentPage = 0
        this.dataList = []
        this.loadData()
      },
      _onRefresh () {
        this.refreshing = true
        this.queryObject.currentPage = 0
        this.dataList = []
        this.loadData()
      },
      // _onEndReached () {
      //   if (this.isEndReached) {
      //     this.endReachedMsg = '已到底，没有更多'
      //   } else {
      //     this.queryObject.currentPage++
      //     this.loadData()
      //   }
      // },
      clearTime () {
        if (this.pageTimeout) clearTimeout(this.pageTimeout)
      },
      _onEndReached: function (pageNum) {
        console.log('pageNum:>>' + pageNum)
        const me = this
        me.clearTime()
        me.pageTimeout = setTimeout(function() {
          me.queryObject.currentPage = me.queryObject.currentPage + 1
          if (me.isEndReached) {
            me.endReachedMsg = '已到底，没有更多'
          } else if (pageNum !== me.queryObject.currentPage) {
              console.log('加载数据:>>>>' + me.queryObject.currentPage)
              me.loadData()
          }
        }, 200)
      },
      async loadData () {
        try {
          this.endReachedMsg = '加载中...'
          this.queryObject.uid = this.currentUser.id
          if (this.searchKey.toString().trim().length > 0) {
            this.queryObject.compName = this.searchKey
          } else {
            if (this.queryObject.compName) delete this.queryObject.compName
          }
          let data = await this.reqPost(this.currentUser.serverUrl + this.webApi.crmQueryCallAPI, this.queryObject, 'post')
          if (data.returnCode === 0) {
            data.list.map(itm => {
              itm[0].planVisitTime = this.datetime2Str(new Date(itm[0].planVisitTime))
              this.dataList.push(itm[0])
            })
            if (this.queryObject.currentPage === 0) this.refreshing = false
            if (this.queryObject.currentPage > 0 && data.list.length === 0) this.queryObject.currentPage--
            this.isEndReached = (data.list.length < this.queryObject.pageSize ) ? true : false
            this.endReachedMsg = (data.list.length == 0) ? '已到底，没有更多' : '加载完成'
          } else {
            this.msgShow(data.errMsg)
          }
        } catch (e) {
          console.warn(e)
        }
      },
      choose (item) {
        this.back(item)
      }
    }
  }
</script>