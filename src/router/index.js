import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const Router = createRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.config.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.config.js instead!
  history: createWebHistory(process.env.VUE_ROUTER_BASE),
  scrollBehavior: () => ({
    left: 0,
    top: 0,
  }),
  routes,
})

// Convert Vue 2 navigation guard to Vue 3
Router.beforeEach((to, from, next) => {
  if (localStorage.getItem("auth_token") == undefined) {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("u_i")
    next()
  } else {
    let roles = []
    JSON.parse(localStorage.getItem("u_i")).roles.map(function(oo) {
      roles.push(oo.hierarchy.hierarchyCode)
    })
    if (roles.includes(to.matched[0].name)) {
      next()
    } else {
      if (to.matched[0].name == "primaryLogin") {
        next()
      } else {
        next(false)
      }
    }
  }
})

export default Router
