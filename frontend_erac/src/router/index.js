import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'stores/auth'
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Add navigation guards
  Router.beforeEach((to) => {
    const authStore = useAuthStore()
    const publicPages = ['/', '/signup', '/admin/login']
    const authRequired = !publicPages.includes(to.path)

    // Redirect to login if auth required and not logged in
    if (authRequired && !authStore.token) {
      authStore.returnUrl = to.fullPath
      return '/'
    }

    // Prevent access to login page when already logged in
    if (to.path === '/' && authStore.token) {
      return '/home/dashboard'
    }
  })

  return Router
})
