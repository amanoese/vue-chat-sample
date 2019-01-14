import Vue from 'vue'
import App from './App.vue'

import firebase from 'firebase'
Vue.config.productionTip = false

// Initialize Firebase
const config = { };
firebase.initializeApp(config);

new Vue({
  render: h => h(App),
}).$mount('#app')
