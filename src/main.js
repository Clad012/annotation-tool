import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import Annotatable from './components/Annotatable.vue'
import OutputArea from './components/Output.vue'
import {randomId} from './utils'
import { SpinnerPlugin, LayoutPlugin, ModalPlugin, CardPlugin, NavbarPlugin, ButtonPlugin, FormInputPlugin, PaginationPlugin, FormPlugin, FormGroupPlugin, SidebarPlugin, ToastPlugin, BadgePlugin, FormRadioPlugin     } from 'bootstrap-vue'
import Navbar from './components/navbar.vue'

import { FormFilePlugin } from 'bootstrap-vue'
Vue.use(FormFilePlugin)
import VueUploadComponent from 'vue-upload-component'

Vue.use(LayoutPlugin)
Vue.use(ModalPlugin)
Vue.use(CardPlugin)
Vue.use(NavbarPlugin)
Vue.use(ButtonPlugin)
Vue.use(FormInputPlugin)
Vue.use(PaginationPlugin)
Vue.use(FormPlugin)
Vue.use(FormGroupPlugin)
Vue.use(SidebarPlugin)
Vue.use(ToastPlugin)
Vue.use(BadgePlugin)
Vue.use(SpinnerPlugin)
Vue.use(FormRadioPlugin )
 
Vue.component('navbar', Navbar);
Vue.component('file-upload', VueUploadComponent)

Vue.config.productionTip = false

// Vue.component(Annotatable);
Vue.component('output-area', OutputArea);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
