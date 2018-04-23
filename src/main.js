import Vue from 'vue'
import VueRouter from 'vue-router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import store from './store/index'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueResource from 'vue-resource'
import * as qiniu from 'qiniu-js'

import 'swiper/dist/css/swiper.css'
import App from './App.vue'
import routes from './router/router'
import { ROUTERMODE } from './config/env'
import utils from './util/util'
import './assets/style/reset.scss'
import './assets/style/common.scss'

Vue.config.productionTip = false

const router = new VueRouter({
	routes,
	mode: ROUTERMODE,
	// base: '/wenchao/',
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
			return { x: 0, y: to.meta.savedPosition || 0 }
		}
	}
})


// 使用moment处理日期格式
import Moment from 'moment'
Vue.filter('convertTime', function (timeStr) {
  return Moment(timeStr).format('YYYY-MM-DD hh:mm:ss')
})

// 处理商品名称
Vue.filter('mySubstr',function(titleStr,num) {
	if(titleStr.length <= num) return titleStr;
	else
		return titleStr.substr(0,num) + '...'
})

// router.beforeEach((to, from, next) => {
// 	const toDepth = to.path.split('/').length
// 	const fromDepth = from.path.split('/').length
// 	if (toDepth < fromDepth) {
// 		from.meta.keepAlive = false
// 		to.meta.keepAlive = true
// 	}	
// 	next()
// })

Vue.use(VueRouter)
Vue.use(Mint)
Vue.use(VueResource)
Vue.use(VueAwesomeSwiper)
Vue.use(qiniu)
Vue.prototype.utils = utils;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
