import Vue from 'vue'
import Router from 'vue-router'
import Cv from '@/components/Cv'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/cv',
      name: 'CV',
      component: Cv
    }
  ]
})
