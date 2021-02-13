import Vue from 'vue'
import Router from 'vue-router'
import LiftDataBlock from '@/pages/liftDataBlock'
import LiftData from '@/pages/liftData'
import LiftModel from '@/pages/liftModel'
import Panel from '@/pages/panel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/panel',
      name: 'panel',
      component: Panel
    },
    {
      path: '/liftDataBlock',
      name: 'liftDataBlock',
      component: LiftDataBlock
    }, {
      path: '/liftData',
      name: 'liftData',
      component: LiftData
    }, {
      path: '/liftModel',
      name: 'liftModel',
      component: LiftModel
    }
  ]
})
