<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
    touchable-opacity(:on-press="clickIcon.bind(this,'visitCreate')", slot="rightBtns")
      //- iconfont(name="add", :size="20", color="#fff")
      iconfont(name="add", :size="20", color="#fff")
  view(:hasTab="true", :style="{height: 40}")
    app-tab(:tabs="tabsVal", :onChange="tabHandler")
  nb-content(:style="[{backgroundColor: '#f2f2f2'}, styl.pt10]")
    cstm-base-info(:cstmData="baseInfo", v-if="tabName == 0")
    cstm-base-info(:cstmData="contactInfo", v-else-if="tabName == 1")
    view(v-else, :style="[styl.pl10,styl.pr10]")
      no-data(v-if="nodataShow", btnText="新建拜访计划", btnUrl="visitCreate", :btnHandler="noDataBtn", msg="您还没有拜访计划")
      view(v-else, :style="[styl.bgWhite, styl.pad10, styl.mb10,{paddingBottom:0},{borderRadius:5}]", v-for="item in visiList")
        view.list-hed
          text(:style="[styl.color33, styl.ft14]") 拜访签到
        view.visi-list(:style="[styl.row, styl.mb10,styl.bgWhite, styl.pad5]")
          view(:style="[styl.row, {flex: 1}]")
            view(:style="[styl.col]")
              view(:style="[styl.rowStart,styl.pb10, styl.pt5]")
                iconfont(name="time", :size="13", color="#666")
                text(:style="[styl.color66, styl.ft13,styl.pl5]") 计划拜访时间
              view(:style="styl.rowStart")
                text(:style="[styl.ft16, item.color]") {{item.dayStr}}
                text(:style="[styl.ft16, item.color, styl.pl5]") {{item.timeStr}}
          view(:style="[{alignItems: 'center'}]")
            nb-button.qd-btn(:style="[styl.bgPrimary]", :onPress="goToSign.bind(this, item)")
              text(:style="[styl.colorWhite, styl.ft12, styl.textC]") 签 到
</template>

<script>
import Iconfont from '../../components/vue/iconfont/index'
import cstmBaseInfo from '../../components/vue/customer/CstmBaseInfo'
import { mapState } from 'vuex'
export default {
  props: {
    navigation: {
      type: Object
    }
  },
  components: {
    cstmBaseInfo,
    iconfont: Iconfont
  },
  computed: {
    ...mapState({
      currentUser: state => state.currentUser
    })
  },
  data () {
    return {
      routeListener: null,
      tabsVal: [{name: '基本信息'}, {name: '联系人信息'}, {name: '拜访信息'}],
      styl: {
        headBorderR: {
          borderStyle: 'solid',
          borderRightColor: '#ccc',
          borderRightWidth: 0.5
        }
      },
      tabName: 0,
      baseInfo: {
        lable: [
        {
          lbl: '公司名称',
          prop: 'compName'
        }, {
          lbl: '客户类型',
          prop: 'customerType'
        }, {
          lbl: '公司简称',
          prop: 'compNameAb'
        }, {
          lbl: '助记编码',
          prop: 'memberCode'
        }, {
          lbl: '工商编码',
          prop: 'busiLicenseCode'
        }, {
          lbl: '业务关系',
          prop: 'busiRelation'
        }, {
          lbl: '客户性质',
          prop: 'fkCustomProperty'
        }, {
          lbl: '业务部门',
          prop: 'fkDpt'
        }, {
          lbl: '业务人员',
          prop: 'fkAcct'
        }],
        data: {}
      },
      contactInfo: {
        lable: [{
          lbl: '联系人员',
          prop: 'name'
        }, {
          lbl: '联系方式',
          prop: 'phone'
        }, {
          lbl: '公司地址',
          prop: 'compAddr'
        }, {
          lbl: '地区',
          prop: 'region'
        }],
        data: {}
      },
      cstmObj: {},
      queryObj: {
        currentPage: 0,
        pageSize: 100,
        uid: '',
        cstmId: ''
      },
      visiList: [],
      nodataShow: false
    }
  },
  mounted () {
    this.visiList = []
    this.loadData()
    console.log('------navigation------')
    console.log(this.navigation)
    const me = this
    this.routeListener = this.navigation.addListener('willFocus', (prepload) => {
      console.log('重新加载')
      if (me.tabName == 2) {
        me.queryObj.currentPage = 0
        me.visiList = []
        me.visitInfo()
      }
    })
  },
  methods: {
    async loadData () {
      try {
        let data = await this.reqPost(this.currentUser.serverUrl + this.webApi.crmQuerySingleCstmAPI + '/' + this.navigation.state.params.id, {})
        if (data.returnCode === 0) {
          console.log('---detail----')
          console.log(data)
          let resObj = data.obj
          let busiRelationArr = []
          if (resObj.busiRelation) {
            resObj.busiRelation.map(item => {
              busiRelationArr.push(item.name)
            })
          }
          this.baseInfo.data = {
            compName: resObj.compName,
            customerType: (resObj.customerType == 1) ? '公司客户' : (resObj.customerType == 2) ? '个人客户' : '',
            memberCode: resObj.memberCode,
            compNameAb: resObj.compNameAb,
            busiLicenseCode: resObj.busiLicenseCode,
            busiRelation: busiRelationArr.toString(),
            fkCustomProperty: resObj.fkCustomProperty.name,
            fkDpt: resObj.fkDpt.name,
            fkAcct: resObj.fkAcct.name
          }
          this.contactInfo.data = resObj.linkers[0]
          let compProv = (resObj.compProv) ? resObj.compProv : ''
          let compCity = (resObj.compCity)? resObj.compCity :''
          let compArea = (resObj.compArea)? resObj.compArea :''
          let compAddr = (resObj.compAddr)? resObj.compAddr: ''
          this.contactInfo.data['compAddr'] = compProv + compCity + compArea + compAddr
          this.contactInfo.data['compArea'] = resObj.compArea
          this.contactInfo.data['region'] = resObj.region
          this.cstmObj = resObj
        } else {
          console.warn(data)
          this.msgShow(data.errMsg)
        }
      } catch (e) {
        console.warn(e)
        alert(e)
      }
    },
    // headBoxHandler: function (type) {
    //   this.tabName = type
    // },
    clickIcon: function (pageName) {
      this.cstmObj.from = this.navigation.state.routeName
      let me = this
      this.cstmObj.callBack = function (res) {
        console.log('---1233----')
        console.log(res)
        if (me.tabName == 2) {
          me.visitInfo()
        }
      }
      this.navigate(pageName, this.cstmObj)
    },
    async visitInfo () {
      try {
        let data = await this.reqPost(this.currentUser.serverUrl + this.webApi.crmCstmCallListAPI, this.queryObj, 'post')
        if (data.returnCode === 0) {
          console.log('---visitInfo----')
          console.log(data)
          let res = data.list
          let arr = []
          res.map(item => {
            let obj={}
            let visiTimeDate = new Date(item[0].planVisitTime)
            let visiTime = new Date(this.date2Str(visiTimeDate)).getTime()
            let nowTime = new Date(this.date2Str(new Date())).getTime()
            let n = parseInt((visiTime - nowTime) / 86400000)
            console.log('---visiTime----')
            console.log(visiTime)
            console.log('---nowTime---')
            console.log(nowTime)
            console.log('-----n----')
            console.log(n)
            switch (n) {
              case 0:
                obj.dayStr = '今天'
                obj.color = {
                  color: '#f66c6c'
                }
                break
              case 1:
                obj.dayStr = '明天'
                obj.color = {
                  color: '#f5b84e'
                }
                break
              case 2:
                obj.dayStr = '后天'
                obj.color = {
                  color: '#4ebdff'
                }
                break
              default:
                let timeArr = this.date2Str(new Date(visiTime)).split('/')
                obj.dayStr = timeArr[0] + '年' + timeArr[1] + '月' + timeArr[2] + '日'
                obj.color = {
                  color: '#333'
                }
                break
            }
            let hours = (visiTimeDate.getHours() < 10) ? '0' + visiTimeDate.getHours() : visiTimeDate.getHours()
            let min = (visiTimeDate.getMinutes() < 10) ? '0' + visiTimeDate.getMinutes() : visiTimeDate.getMinutes()
            obj.timeStr = hours + ':' + min
            obj.customer = {
              compName: item[0]['customer']['compName']
            }
            obj.id = item[0]['id']
            arr.push(obj)
          })
          this.visiList = arr
          this.nodataShow = (arr.length === 0) ? true : false
        } else {
          console.warn(data)
          this.msgShow(data.errMsg)
        }
      } catch (e) {
        console.warn(e)
        alert(e)
      }
    },
    tabHandler: function (type) {
      this.tabName = (type == '基本信息') ? 0 : (type == '联系人信息') ? 1 : 2
      if (type == '拜访信息') {
        this.queryObj.uid= this.currentUser.id
        this.queryObj.cstmId = this.cstmObj.id
        this.visitInfo()
      }
    },
    noDataBtn: function () {
      this.cstmObj.from = 'cstmDetail'
      let me = this
      this.cstmObj.callBack =  function (res) {
        me.visitInfo()
      }
      this.navigate('visitCreate', this.cstmObj)
    },
    goToSign (item) {
      let temp = Object.assign({}, item)
      temp.isFromVisitList = true
      this.navigate('visitCheck', temp)
    }
  }
}
</script>
<style lang="stylus">
  .list-hed{
    borderBottomWidth: 1;
    borderColor: #eee;
    paddingBottom: 5px;
  }
  .visi-list{
    borderRadius: 5;
  }
  .visi-list text{
    color: red;
  }
  .qd-btn{
    borderRadius: 30;
    height: 30;
    // lineHeight: 30;
    paddingLeft: 15;
    paddingRight: 15;
  }
</style>