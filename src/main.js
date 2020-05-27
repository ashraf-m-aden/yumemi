import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueGoogleCharts from 'vue-google-charts'
axios.defaults.headers.common['X-API-KEY'] = 'opFZVW2F1kO4BLDgxXxZbAIJRC2w9kayoH0WoqPo'
Vue.use(VueAxios, axios)

Vue.use(VueGoogleCharts)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
