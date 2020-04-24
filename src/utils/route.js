import { DrawerNavigator } from 'vue-native-router'
// 我的
import AboutUsScreen from '../screens/me/aboutUs.vue'
import UpdatePwdScreen from '../screens/me/updatePwd.vue'
import SettingScreen from '../screens/me/setting.vue'

// 商机
import BusiOptListScreen from '../screens/busiOpts/index.vue'
import BusiOptCreateScreen from '../screens/busiOpts/create.vue'
import BusiOptCreateDetailScreen from '../screens/busiOpts/detail.vue'
import BusiOptFilterScreen from '../screens/busiOpts/filter.vue'
// 客户
import CstmChooseScreen from '../screens/customer/choose.vue'
import CstmDetailScreen from '../screens/customer/detail.vue'
import CstmFilterScreen from '../screens/customer/filter.vue'

// 拜访
import VisitListScreen from '../screens/visit/index.vue'
import VisitCreateScreen from '../screens/visit/create.vue'
import VisitCheckScreen from '../screens/visit/check.vue'
import VisitChooseCstmScreen from '../screens/visit/choose.vue'

// 用户登录
import LoginScreen from '../screens/LoginScreen.vue'

// 用户注册
import RegScreen from '../screens/RegScreen.vue'

// 搜索
import SearchScreen from '../screens/SearchScreen.vue'

// 引导页
import IntroScreen from '../screens/IntroScreen.vue'

// 商机过滤抽屉
const busiOptsFilterDrawer = DrawerNavigator({
  busiOptList: {
    screen: BusiOptListScreen
  },
}, {
  initialRouteName: 'busiOptList',
  drawerWidth: 300,
  drawerPosition: 'right',
  contentComponent: BusiOptFilterScreen
})
const appStack = [{
  key: 'aboutUs',
  screen: AboutUsScreen,
  title: '关于我们'
}, {
  key: 'updatePwd',
  screen: UpdatePwdScreen,
  title: '修改密码'
}, {
  key: 'setting',
  screen: SettingScreen,
  title: '设置'
}, {
  key: 'busiOptList',
  screen: busiOptsFilterDrawer,
  title: '商机管理'
}, {
  key: 'busiOptCreate',
  screen: BusiOptCreateScreen,
  title: '新建商机'
}, {
  key: 'busiOptDetail',
  screen: BusiOptCreateDetailScreen,
  title: '商机详情'
}, {
  key: 'cstmChoose',
  screen: CstmChooseScreen,
  title: '选择客户'
}, {
  key: 'cstmDetail',
  screen: CstmDetailScreen,
  title: '客户详情'
}, {
  key: 'visitList',
  screen: VisitListScreen,
  title: '拜访管理'
}, {
  key: 'visitCheck',
  screen: VisitCheckScreen,
  title: '快速签到'
}, {
  key: 'chooseVisitCstm',
  screen: VisitChooseCstmScreen,
  title: '选择签到客户'
}, {
  key: 'visitCreate',
  screen: VisitCreateScreen,
  title: '新建拜访'
}, {
  key: 'login',
  screen: LoginScreen,
  title: '用户登录'
}, {
  key: 'reg',
  screen: RegScreen,
  title: '用户注册'
}, {
  key: 'search',
  screen: SearchScreen,
  title: '搜索'
}, {
  key: 'intro',
  screen: IntroScreen,
  title: '引导页'
}]

let routes = {}
let routeNames = {}
appStack.map(itm => {
  routes[itm.key] = itm.screen
  routeNames[itm.key] = itm.title
})

// 主页堆栈
export default {
  routes,
  routeNames
}