import Vue from 'vue'
import Router from 'vue-router'
import Cv from '@/components/Cv'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CV',
      component: Cv
    }
  ]
})
