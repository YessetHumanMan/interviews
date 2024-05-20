import { type RouteRecordRaw, RouteParams } from "vue-router"
import {createWebHashHistory, createRouter } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Add from './pages/Add.vue'

const checkAuth = (to:RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  let isAuth = false

  onAuthStateChanged(getAuth(), (user) => {
    if(user && !isAuth ) {
      isAuth = true
      next()
    } else if (!user && !isAuth) {
      isAuth = true
      next('/auth')
    }
  })
}

export type AppRouterNames =
| 'Authorization'
| 'Add'
| 'List'
| 'Statistic'

export const routes: RouteRecordRaw[] = [
{
  name: 'Authorization',
  path: '/auth',
  component: () => import('./pages/Authorization.vue'),
  
},
{
  name: 'Add',
  path: '/',
  component: Add,
  beforeEnter: checkAuth
},
{
  name: 'List',
  path: '/list',
  component: () => import('./pages/List.vue')
},
{
  name: 'Statistic',
  path: '/statistic',
  component: () => import('./pages/Statistic.vue')
},
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export function routerPush(name:AppRouterNames,params?:RouteParams):ReturnType<typeof router.push>{
return params === undefined
? router.push({name})
: router.push({name, params})
}