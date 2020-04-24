import Vue from 'vue-native-core'

import store from '../vuex/store'
import mixins from '../vuex/mixins'
import iconfont from '../components/vue/iconfont'
import appHeader from '../components/vue/appHeader'
import appModal from '../components/vue/modal'
import appTab from '../components/vue/appTab'
import noData from '../components/vue/noData'
import { AppInput, AppTextarea } from '../components/react/input'

Vue.mixin(mixins)
Vue.component('iconfont', iconfont)
Vue.component('appHeader', appHeader)
Vue.component('appTab', appTab)
Vue.component('nbInput', AppInput)
Vue.component('nbTextarea', AppTextarea)
Vue.component('noData', noData)
Vue.prototype.$store = store

