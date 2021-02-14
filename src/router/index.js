import Vue from 'vue'
import Router from 'vue-router'
import LiftDataBlock from '@/pages/liftDataBlock'
import LiftData from '@/pages/liftData'
import LiftModel from '@/pages/liftModel'
import Panel from '@/pages/panel'
import Test from '@/pages/test'
import Test2 from '@/pages/test2'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/test2',
      name: 'test2',
      component: Test2
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
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
