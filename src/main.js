// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import RaceHistory from '@/components/RaceHistory'
import RaceTimer from '@/components/RaceTimer'

require('./assets/sass/main.scss')

Vue.config.productionTip = false

Vue.component('RaceHistory', RaceHistory)
Vue.component('RaceTimer', RaceTimer)

var moment = require('vue-moment')
Vue.use(moment)

// shared events bus
window.Event = new Vue()

Vue.prototype.$bus = new Vue({})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

// register service loader for offline caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
  })
}
