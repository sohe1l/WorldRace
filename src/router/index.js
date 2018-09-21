import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import WorldRace from '@/components/WorldRace'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/race',
      name: 'WorldRace',
      component: WorldRace
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
